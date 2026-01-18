<script lang="ts">
	import { commandPalette } from "$lib/core/navigation/command-palette.svelte.js";
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
	import { setTheme } from "$lib/core/theme/theme.svelte";
	import { cn } from "$lib/shared/merge-class";
	import Fuse from "fuse.js";
	import {
		Home,
		SearchCode,
		BookOpen,
		Sun,
		Moon,
		Monitor,
		FileText,
		CornerDownLeft,
		Sparkles,
		X
	} from "@lucide/svelte";
	import type { Component } from "svelte";

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
		icon: Component;
		type: "post" | "action";
		action: () => void;
	}

	let searchIndex = $state<SearchItem[]>([]);
	let isLoading = $state(false);
	let hasLoaded = $state(false);

	let searchInputElement = $state<HTMLInputElement>();
	let query = $state("");
	let selectedIndex = $state(0);

	let isSearchExpanded = $derived(commandPalette.isOpen);

	$effect(() => {
		if (isSearchExpanded && !hasLoaded && !isLoading) {
			isLoading = true;
			fetch("/api/search.json")
				.then((res) => res.json())
				.then((data) => {
					searchIndex = data;
					hasLoaded = true;
				})
				.finally(() => {
					isLoading = false;
				});
		}
	});

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

	const fuse = $derived(
		new Fuse(searchableData, {
			keys: [
				{ name: "title", weight: 1.0 },
				{ name: "tags", weight: 0.8 },
				{ name: "content", weight: 0.3 }
			],
			threshold: 0.4,
			distance: 200,
			minMatchCharLength: 2,
			ignoreLocation: true,
			includeScore: true
		})
	);

	const filteredResults = $derived.by(() => {
		const q = query.trim();
		if (!q) return searchableData;
		const results = fuse.search(q);
		return results.map((r) => r.item);
	});

	$effect(() => {
		void filteredResults.length;
		selectedIndex = 0;
	});

	$effect(() => {
		if (isSearchExpanded) {
			setTimeout(() => searchInputElement?.focus(), 150);
		}
	});

	function closeSearch() {
		commandPalette.close();
		query = "";
	}

	function navigate(path: string) {
		goto(`${base}${path}`);
		closeSearch();
	}

	function updateTheme(theme: "light" | "dark" | "system") {
		setTheme(theme);
		closeSearch();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			e.stopPropagation();
			closeSearch();
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
		const activeEl = document.querySelector(`[data-nav-index="${selectedIndex}"]`);
		if (activeEl) {
			activeEl.scrollIntoView({ block: "nearest" });
		}
	}
</script>

<div
	class="border-border-vivid/20 bg-surface-elevated/80 dark:border-border-vivid/15 absolute bottom-full left-0 mb-4 w-full origin-bottom overflow-hidden rounded-2xl border shadow-(--shadow-depth-4) ring-1 ring-white/10 backdrop-blur-2xl backdrop-saturate-150 dark:ring-white/5"
>
	<div class="scrollbar-none max-h-[50vh] overflow-y-auto p-2">
		{#if filteredResults.length > 0}
			<div class="flex flex-col gap-0.5">
				{#each filteredResults as item, i (item.id)}
					<button
						class={cn(
							"flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 ease-out",
							selectedIndex === i
								? "bg-primary/15 text-primary ring-primary/25 ring-1"
								: "text-muted hover:text-text hover:bg-action-hover active:scale-[0.98]"
						)}
						onclick={item.action}
						data-nav-index={i}
					>
						<div class="bg-surface/50 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg">
							<item.icon size={16} />
						</div>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-medium tracking-tight">{item.title}</p>
							{#if item.type === "post"}
								<p class="truncate text-[11px] opacity-50">Artigo</p>
							{/if}
						</div>
						{#if selectedIndex === i}
							<CornerDownLeft class="shrink-0 opacity-40" size={14} />
						{/if}
					</button>
				{/each}
			</div>
		{:else if isLoading}
			<div class="flex animate-pulse flex-col items-center justify-center py-8 text-center">
				<SearchCode size={32} class="text-muted/50 mb-2" />
				<p class="text-muted text-sm">Cultivando índice...</p>
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-8 text-center">
				<SearchCode size={32} class="text-muted/50 mb-2" />
				<p class="text-muted text-sm">Nada encontrado</p>
			</div>
		{/if}
	</div>

	<div
		class="border-border/50 bg-surface/30 text-muted flex items-center justify-between border-t px-4 py-2.5 text-[10px]"
	>
		<div class="flex items-center gap-3">
			<span class="flex items-center gap-1.5">
				<kbd
					class="border-border/60 bg-surface inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 font-mono text-[9px] shadow-sm"
					>↑↓</kbd
				>
				<span class="opacity-70">navegar</span>
			</span>
			<span class="flex items-center gap-1.5">
				<kbd
					class="border-border/60 bg-surface inline-flex h-5 min-w-5 items-center justify-center rounded border px-1.5 font-mono text-[9px] shadow-sm"
					>↵</kbd
				>
				<span class="opacity-70">selecionar</span>
			</span>
		</div>
		<div>
			<span class="flex items-center gap-1.5">
				<kbd
					class="border-border/60 bg-surface inline-flex h-5 items-center justify-center rounded border px-1.5 font-mono text-[9px] shadow-sm"
					>esc</kbd
				>
				<span class="opacity-70">fechar</span>
			</span>
		</div>
	</div>
</div>

<div class="flex w-full items-center gap-3 px-3">
	<div class="text-primary shrink-0">
		<Sparkles size={18} class="animate-pulse" />
	</div>
	<input
		bind:this={searchInputElement}
		bind:value={query}
		type="text"
		placeholder="Buscar artigos, temas..."
		class="text-text placeholder:text-muted/60 flex-1 bg-transparent text-sm tracking-tight focus:outline-none"
		onkeydown={handleKeydown}
	/>
	<button
		type="button"
		class="text-muted hover:text-text bg-action-hover flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-150 ease-out hover:bg-white/15 active:scale-95 dark:bg-white/5 dark:hover:bg-white/10"
		onclick={closeSearch}
		aria-label="Fechar busca (Esc)"
	>
		<X size={16} />
	</button>
</div>
