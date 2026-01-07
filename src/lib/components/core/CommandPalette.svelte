<script lang="ts">
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { commandPalette } from "$lib/stores/command-palette.svelte";
	import { setTheme } from "$lib/stores/theme.svelte";
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
	import Fuse from "fuse.js";
	import {
		Search,
		FileText,
		Moon,
		Sun,
		Monitor,
		Home,
		BookOpen,
		CornerDownLeft,
		SearchCode
	} from "@lucide/svelte";

	interface SearchItem {
		title: string;
		slug: string;
		kind?: string;
		tags?: string[];
		content?: string;
	}

	interface CommandItem {
		id: string;
		title: string;
		icon: typeof Search;
		type: "post" | "action";
		action: () => void;
	}

	interface Props {
		searchIndex: SearchItem[];
	}

	let { searchIndex = [] }: Props = $props();

	let query = $state("");
	let selectedIndex = $state(0);
	let inputElement = $state<HTMLInputElement>();

	// Hardcoded static actions
	const staticActions: CommandItem[] = [
		{ id: "home", title: "Ir para Home", icon: Home, type: "action", action: () => navigate("/") },
		{
			id: "garden",
			title: "Explorar Jardim",
			icon: SearchCode,
			type: "action",
			action: () => navigate("/garden")
		},
		{
			id: "posts",
			title: "Ver Artigos",
			icon: BookOpen,
			type: "action",
			action: () => navigate("/posts")
		},
		{
			id: "theme-light",
			title: "Tema: Claro",
			icon: Sun,
			type: "action",
			action: () => updateTheme("light")
		},
		{
			id: "theme-dark",
			title: "Tema: Escuro",
			icon: Moon,
			type: "action",
			action: () => updateTheme("dark")
		},
		{
			id: "theme-system",
			title: "Tema: Sistema",
			icon: Monitor,
			type: "action",
			action: () => updateTheme("system")
		}
	];

	// Prepare the full searchable dataset
	const searchableData = $derived([
		...staticActions,
		...searchIndex.map((p) => ({
			id: p.slug,
			title: p.title,
			icon: FileText,
			type: "post" as const,
			action: () => navigate(`/posts/${p.slug}`),
			tags: p.tags,
			content: p.content
		}))
	]);

	// Initialize Fuse
	const fuse = $derived(
		new Fuse(searchableData, {
			keys: [
				{ name: "title", weight: 1.0 },
				{ name: "tags", weight: 0.8 },
				{ name: "content", weight: 0.3 }
			],
			threshold: 0.4, // Tolerance for typos
			distance: 200, // Increased distance for longer content
			minMatchCharLength: 2,
			ignoreLocation: true, // Crucial for long content search
			includeScore: true
		})
	);

	// Filtered results using Fuzzy Logic
	const filteredResults = $derived.by(() => {
		const q = query.trim();
		if (!q) return searchableData;

		const results = fuse.search(q);
		return results.map((r) => r.item);
	});

	// Reset selection when results change
	$effect(() => {
		// Just accessing the dependency to trigger the effect
		void filteredResults.length;
		selectedIndex = 0;
	});

	function navigate(path: string) {
		goto(`${base}${path}`);
		commandPalette.close();
		query = "";
	}

	function updateTheme(theme: "light" | "dark" | "system") {
		setTheme(theme);
		commandPalette.close();
		query = "";
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			commandPalette.close();
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			selectedIndex = (selectedIndex + 1) % filteredResults.length;
			scrollIntoView();
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			selectedIndex = (selectedIndex - 1 + filteredResults.length) % filteredResults.length;
			scrollIntoView();
		} else if (e.key === "Enter") {
			e.preventDefault();
			const selected = filteredResults[selectedIndex];
			if (selected) selected.action();
		}
	}

	function scrollIntoView() {
		const activeEl = document.querySelector(`[data-index="${selectedIndex}"]`);
		if (activeEl) {
			activeEl.scrollIntoView({ block: "nearest" });
		}
	}

	// Focus input on open
	$effect(() => {
		if (commandPalette.isOpen && inputElement) {
			setTimeout(() => inputElement?.focus(), 50);
		}
	});

	onMount(() => {
		const listener = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				commandPalette.toggle();
			}
		};
		window.addEventListener("keydown", listener);
		return () => window.removeEventListener("keydown", listener);
	});
</script>

{#if commandPalette.isOpen}
	<div
		class="fixed inset-0 z-100 flex items-start justify-center p-4 pt-[15vh] sm:p-6 sm:pt-[20vh]"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onkeydown={handleKeydown}
	>
		<!-- Backdrop -->
		<button
			type="button"
			class="absolute inset-0 block h-full w-full bg-black/40 backdrop-blur-sm"
			transition:fade={{ duration: 200 }}
			onclick={() => commandPalette.close()}
			aria-label="Fechar busca"
		></button>

		<!-- Palette -->
		<div
			class="bg-surface border-border-default relative w-full max-w-2xl overflow-hidden rounded-xl border shadow-2xl ring-1 ring-black/5"
			transition:fly={{ y: -20, duration: 300, opacity: 0 }}
		>
			<!-- Search Header -->
			<div class="flex items-center border-b border-white/5 px-4">
				<Search class="text-text-muted h-5 w-5" />
				<input
					bind:this={inputElement}
					bind:value={query}
					type="text"
					placeholder="O que você está procurando? (Busque por artigos, temas...)"
					class="text-text-heading placeholder:text-text-muted/50 flex-1 bg-transparent px-4 py-4 text-base outline-none"
				/>
				<div class="flex items-center gap-1">
					<kbd
						class="text-text-muted hidden items-center gap-1 rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-medium sm:flex"
					>
						ESC
					</kbd>
				</div>
			</div>

			<!-- Results List -->
			<div class="scrollbar-hide max-h-[50vh] overflow-y-auto p-2">
				{#if filteredResults.length > 0}
					<div class="space-y-1">
						{#each filteredResults as item, i (item.id)}
							<button
								class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors {selectedIndex ===
								i
									? 'bg-brand-primary/10 text-brand-primary ring-brand-primary/20 ring-1'
									: 'text-text-body hover:bg-white/5'}"
								onclick={item.action}
								data-index={i}
							>
								<div
									class="flex h-8 w-8 items-center justify-center rounded-md border border-white/5 {selectedIndex ===
									i
										? 'bg-brand-primary/20'
										: 'bg-white/5'}"
								>
									<item.icon size={18} />
								</div>
								<div class="flex-1 overflow-hidden">
									<p class="truncate font-medium">{item.title}</p>
									{#if item.type === "post"}
										<p class="text-text-muted truncate text-xs">Artigo • {item.id}</p>
									{:else}
										<p class="text-text-muted text-xs">Ação do Sistema</p>
									{/if}
								</div>
								{#if selectedIndex === i}
									<CornerDownLeft class="text-brand-primary/50" size={14} />
								{/if}
							</button>
						{/each}
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center py-12 text-center">
						<SearchCode size={48} class="text-text-muted/20 mb-4" />
						<p class="text-text-muted">Nenhum resultado encontrado para "{query}"</p>
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div
				class="bg-surface-base/50 flex items-center justify-end gap-4 border-t border-white/5 px-4 py-2"
			>
				<div class="flex items-center gap-1.5">
					<kbd class="rounded border border-white/10 bg-white/5 px-1 py-0.5 text-[10px]">↑↓</kbd>
					<span class="text-text-muted text-[10px]">Navegar</span>
				</div>
				<div class="flex items-center gap-1.5">
					<kbd class="rounded border border-white/10 bg-white/5 px-1 py-0.5 text-[10px]">Enter</kbd>
					<span class="text-text-muted text-[10px]">Selecionar</span>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
