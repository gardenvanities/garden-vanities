<script lang="ts">
	import { commandPalette } from "$lib/core/navigation/command-palette.svelte.js";
	import Kbd from "$lib/ui/Kbd.svelte";
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
	import { setTheme } from "$lib/core/theme/theme.svelte";
	import { cn } from "$lib/shared/merge-class";
	import Fuse from "fuse.js";
	import {
		Home,
		Telescope,
		BookOpen,
		Layers,
		FolderOpen,
		Library,
		Info,
		Sun,
		Moon,
		Monitor,
		FileText,
		CornerDownLeft,
		Sparkles,
		X,
		Zap,
		Palette
	} from "@lucide/svelte";
	import type { Component } from "svelte";

	interface SearchItem {
		source: "post" | "resource";
		title: string;
		slug: string;
		kind?: string;
		libraryType?: string;
		tags?: string[];
		description?: string;
		content?: string;
	}

	interface CommandItem {
		id: string;
		title: string;
		icon: Component;
		type: "post" | "action" | "navigation";
		category?: string;
		kind?: string;
		action: () => void;
	}

	let searchIndex = $state<SearchItem[]>([]);
	let isLoading = $state(false);
	let hasLoaded = $state(false);

	let searchInputElement = $state<HTMLInputElement>();
	let resultElements = $state<Array<HTMLButtonElement | undefined>>([]);
	let query = $state("");
	let selectedIndex = $state(0);

	let isSearchOpen = $derived(commandPalette.isOpen);

	$effect(() => {
		if (isSearchOpen && !hasLoaded && !isLoading) {
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

	const navigationActions: CommandItem[] = [
		{
			id: "home",
			title: "Ir para Home",
			icon: Home,
			type: "navigation",
			category: "Navegação",
			action: () => navigate("/")
		},
		{
			id: "explore",
			title: "Explorar Jardim",
			icon: Telescope,
			type: "navigation",
			category: "Navegação",
			action: () => navigate("/explore")
		},
		{
			id: "series",
			title: "Abrir séries",
			icon: Layers,
			type: "navigation",
			category: "Navegação",
			action: () => navigate("/series")
		},
		{
			id: "sets",
			title: "Abrir coleções",
			icon: FolderOpen,
			type: "navigation",
			category: "Navegação",
			action: () => navigate("/sets")
		},
		{
			id: "library",
			title: "Abrir biblioteca",
			icon: Library,
			type: "navigation",
			category: "Navegação",
			action: () => navigate("/library")
		},
		{
			id: "about",
			title: "Sobre o projeto",
			icon: Info,
			type: "navigation",
			category: "Navegação",
			action: () => navigate("/sobre")
		}
	];

	const themeActions: CommandItem[] = [
		{
			id: "theme-light",
			title: "Tema Claro",
			icon: Sun,
			type: "action",
			category: "Aparência",
			action: () => updateTheme("light")
		},
		{
			id: "theme-dark",
			title: "Tema Escuro",
			icon: Moon,
			type: "action",
			category: "Aparência",
			action: () => updateTheme("dark")
		},
		{
			id: "theme-system",
			title: "Tema do Sistema",
			icon: Monitor,
			type: "action",
			category: "Aparência",
			action: () => updateTheme("system")
		}
	];

	const staticActions: CommandItem[] = [...navigationActions, ...themeActions];

	const searchableData = $derived([
		...staticActions,
		...searchIndex
			.filter((p) => p.source === "post")
			.map((p): CommandItem => {
				return {
					id: `post-${p.slug}`,
					title: p.title,
					icon: FileText,
					type: "post",
					category: "Artigos",
					kind: p.kind,
					action: () => navigate(`/posts/${p.slug}`)
				};
			})
	]);

	const fuse = $derived(
		new Fuse(searchIndex, {
			keys: [
				{ name: "title", weight: 1.0 },
				{ name: "tags", weight: 0.8 },
				{ name: "description", weight: 0.5 },
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
		if (!q) return searchableData.slice(0, 8); 
		const results = fuse.search(q);
		
		
		
		

		return results
			.map((r) => {
				const found = searchableData.find(
					(item) =>
						item.id === (r.item.source === "post" ? `post-${r.item.slug}` : `lib-${r.item.slug}`)
				);
				return found;
			})
			.filter(Boolean) as CommandItem[];
	});

	
	const groupedResults = $derived.by(() => {
		const groups: Record<string, CommandItem[]> = {};
		for (const item of filteredResults) {
			const cat = item.category || "Outros";
			if (!groups[cat]) groups[cat] = [];
			groups[cat].push(item);
		}
		return groups;
	});

	
	const flatResults = $derived(filteredResults);

	$effect(() => {
		void filteredResults.length;
		selectedIndex = 0;
	});

	$effect(() => {
		if (isSearchOpen) {
			setTimeout(() => searchInputElement?.focus(), 100);
		} else {
			query = "";
		}
	});

	function closeSearch() {
		commandPalette.close();
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
			selectedIndex = (selectedIndex + 1) % flatResults.length;
			scrollIntoView();
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			selectedIndex = (selectedIndex - 1 + flatResults.length) % flatResults.length;
			scrollIntoView();
		} else if (e.key === "Enter") {
			e.preventDefault();
			const selected = flatResults[selectedIndex];
			if (selected) selected.action();
		}
	}

	function scrollIntoView() {
		const activeEl = resultElements[selectedIndex];
		if (activeEl) {
			activeEl.scrollIntoView({ block: "nearest" });
		}
	}

	function getCategoryIcon(category: string): Component {
		switch (category) {
			case "Navegação":
				return Zap;
			case "Aparência":
				return Palette;
			case "Artigos":
				return BookOpen;
			default:
				return Sparkles;
		}
	}
</script>

<div
	class="flex max-h-full flex-1 flex-col overflow-hidden rounded-md border border-white/12 bg-surface/85 shadow-[0_0_0_1px_oklch(0_0_0/0.03),0_8px_40px_oklch(0_0_0/0.15),0_2px_12px_oklch(0_0_0/0.08)] backdrop-blur-3xl"
	data-lenis-prevent
>
	
	<div class="flex items-center gap-3 border-b border-border/20 px-5 py-4">
		<div class="flex items-center justify-center text-muted">
			<Sparkles size={18} strokeWidth={2} />
		</div>
		<input
			bind:this={searchInputElement}
			bind:value={query}
			type="text"
			placeholder={window.innerWidth < 640 ? "Buscar..." : "Buscar artigos, ações..."}
			class="touch-manipulation flex-1 bg-transparent text-base font-medium tracking-[-0.01em] text-text outline-none placeholder:text-muted/70"
			onkeydown={handleKeydown}
		/>
		<button
			type="button"
			class="inline-flex h-6 w-6 items-center justify-center rounded-xs border-none bg-transparent text-muted transition-fast hover:bg-text/5 hover:text-text"
			onclick={closeSearch}
			aria-label="Fechar busca (Esc)"
		>
			<X size={16} strokeWidth={2} />
		</button>
	</div>

	
	<div class="min-h-0 flex-1 touch-manipulation overflow-y-auto p-2">
		{#if isLoading}
			<div class="flex flex-col items-center justify-center px-4 py-12 text-center">
				<div
					class="mb-4 inline-flex h-12 w-12 animate-pulse items-center justify-center rounded-md border border-border/30 bg-surface/50 text-muted"
				>
					<Sparkles size={28} strokeWidth={1.5} />
				</div>
				<p class="text-sm text-muted">Carregando índice...</p>
			</div>
		{:else if flatResults.length === 0}
			<div class="flex flex-col items-center justify-center px-4 py-12 text-center">
				<div
					class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md border border-border/30 bg-surface/50 text-muted"
				>
					<Telescope size={28} strokeWidth={1.5} />
				</div>
				<p class="text-sm text-muted">Nenhum resultado encontrado</p>
			</div>
		{:else}
			{#each Object.entries(groupedResults) as [category, items] (category)}
				{@const CategoryIcon = getCategoryIcon(category)}
				<div class="mb-2">
					<div class="flex items-center gap-2 px-3 py-2 text-[11px] font-semibold tracking-[0.06em] text-muted/80 uppercase">
						<CategoryIcon size={12} strokeWidth={2} />
						<span>{category}</span>
					</div>
					<div>
						{#each items as item (item.id)}
							{@const globalIndex = flatResults.indexOf(item)}
							<button
								class={cn(
									"flex w-full items-center gap-3 rounded-xs border-none bg-transparent px-3 py-3 text-left text-text transition-all duration-150 ease-standard active:scale-[0.995] sm:py-3",
									selectedIndex === globalIndex &&
										"bg-[oklch(from_var(--color-primary)_l_c_h/0.1)] text-text"
								)}
								onclick={item.action}
								data-command-index={globalIndex}
								bind:this={resultElements[globalIndex]}
							>
								<div
									class={cn(
										"inline-flex h-6 w-6 items-center justify-center rounded-xs bg-text/5 text-text/70 transition-fast",
										selectedIndex === globalIndex && "bg-primary text-black/80 opacity-100"
									)}
								>
									<item.icon size={16} strokeWidth={2} />
								</div>
								<span class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[0.9375rem] font-medium tracking-[-0.01em]">
									{item.title}
								</span>
								
								{#if selectedIndex === globalIndex}
									<div class="hidden translate-x-0 opacity-50 transition-fast sm:block">
										<CornerDownLeft size={14} strokeWidth={2} />
									</div>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/each}
		{/if}
	</div>

	
	<div class="hidden items-center justify-between border-t border-border/20 bg-surface/30 px-5 py-3 backdrop-blur-sm sm:flex">
		<div class="flex items-center gap-4">
			<span class="flex items-center gap-1.5 text-[11px] text-muted">
				<Kbd>↑↓</Kbd>
				<span>navegar</span>
			</span>
			<span class="flex items-center gap-1.5 text-[11px] text-muted">
				<Kbd>↵</Kbd>
				<span>selecionar</span>
			</span>
		</div>
		<span class="flex items-center gap-1.5 text-[11px] text-muted">
			<Kbd>esc</Kbd>
			<span>fechar</span>
		</span>
	</div>
</div>
