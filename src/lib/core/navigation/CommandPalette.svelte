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
		const activeEl = document.querySelector(`[data-command-index="${selectedIndex}"]`);
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

<div class="command-container" data-lenis-prevent>
	
	<div class="command-header">
		<div class="command-search-icon">
			<Sparkles size={18} strokeWidth={2} />
		</div>
		<input
			bind:this={searchInputElement}
			bind:value={query}
			type="text"
			placeholder={window.innerWidth < 640 ? "Buscar..." : "Buscar artigos, ações..."}
			class="command-input touch-manipulation"
			onkeydown={handleKeydown}
		/>
		<button
			type="button"
			class="command-close"
			onclick={closeSearch}
			aria-label="Fechar busca (Esc)"
		>
			<X size={16} strokeWidth={2} />
		</button>
	</div>

	
	<div class="command-results">
		{#if isLoading}
			<div class="command-empty">
				<div class="command-empty-icon pulse">
					<Sparkles size={28} strokeWidth={1.5} />
				</div>
				<p class="command-empty-text">Carregando índice...</p>
			</div>
		{:else if flatResults.length === 0}
			<div class="command-empty">
				<div class="command-empty-icon">
					<Telescope size={28} strokeWidth={1.5} />
				</div>
				<p class="command-empty-text">Nenhum resultado encontrado</p>
			</div>
		{:else}
			{#each Object.entries(groupedResults) as [category, items] (category)}
				{@const CategoryIcon = getCategoryIcon(category)}
				<div class="command-group">
					<div class="command-group-header">
						<CategoryIcon size={12} strokeWidth={2} />
						<span>{category}</span>
					</div>
					<div class="command-group-items">
						{#each items as item (item.id)}
							{@const globalIndex = flatResults.indexOf(item)}
							<button
								class={cn("command-item", selectedIndex === globalIndex && "selected")}
								onclick={item.action}
								data-command-index={globalIndex}
							>
								<div class="command-item-icon">
									<item.icon size={16} strokeWidth={2} />
								</div>
								<span class="command-item-title">{item.title}</span>
								
								{#if selectedIndex === globalIndex}
									<div class="command-item-enter hidden sm:block">
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

	
	<div class="command-footer">
		<div class="command-hints">
			<span class="command-hint">
				<Kbd>↑↓</Kbd>
				<span>navegar</span>
			</span>
			<span class="command-hint">
				<Kbd>↵</Kbd>
				<span>selecionar</span>
			</span>
		</div>
		<span class="command-hint">
			<Kbd>esc</Kbd>
			<span>fechar</span>
		</span>
	</div>
</div>

<style>
	@layer components {
		 

		.command-container {
			display: flex;
			flex-direction: column;
			overflow: hidden;
			border-radius: 0.375rem;
			background: oklch(from var(--color-surface) calc(l * 1.05) c h / 0.85);
			backdrop-filter: blur(24px) saturate(1.8);
			-webkit-backdrop-filter: blur(24px) saturate(1.8);
			border: 1px solid oklch(1 0 0 / 0.12);
			box-shadow:
				0 0 0 1px oklch(0 0 0 / 0.03),
				0 8px 40px oklch(0 0 0 / 0.15),
				0 2px 12px oklch(0 0 0 / 0.08);
			max-height: 100%;
			flex: 1;
			transition:
				transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
				opacity 0.2s ease;
		}

		:global(.dark) .command-container {
			background: oklch(from var(--color-surface) calc(l * 0.8) c h / 0.75);
			border-color: oklch(1 0 0 / 0.08);
		}

		 

		.command-header {
			display: flex;
			align-items: center;
			gap: 0.75rem;
			padding: 1rem 1.25rem;
			border-bottom: 1px solid oklch(from var(--color-border) l c h / 0.2);
		}

		.command-search-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--color-muted);
		}

		.command-input {
			flex: 1;
			background: transparent;
			border: none;
			font-size: 1rem;
			font-weight: 450;
			letter-spacing: -0.01em;
			color: var(--color-text);
			outline: none;
		}

		.command-input::placeholder {
			color: var(--color-muted);
			opacity: 0.7;
		}

		.command-close {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 1.5rem;
			height: 1.5rem;
			border-radius: 0.25rem;
			color: var(--color-muted);
			background: transparent;
			border: none;
			cursor: pointer;
			transition: all 150ms var(--motion-ease-standard);
		}

		.command-close:hover {
			color: var(--color-text);
			background: oklch(from var(--color-text) l c h / 0.05);
		}

		 

		.command-results {
			flex: 1;
			min-height: 0;
			overflow-y: auto;
			padding: 0.5rem;
			scrollbar-width: thin;
			scrollbar-color: oklch(from var(--color-border) l c h / 0.3) transparent;
			touch-action: manipulation;
		}

		 

		.command-group {
			margin-bottom: 0.5rem;
		}

		.command-group-header {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			padding: 0.5rem 0.75rem;
			font-size: 0.6875rem;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.06em;
			color: var(--color-muted);
			opacity: 0.8;
		}

		 

		.command-item {
			display: flex;
			align-items: center;
			gap: 0.75rem;
			width: 100%;
			padding: 0.875rem 0.75rem;
			border-radius: 0.25rem;
			color: var(--color-text);
			text-align: left;
			background: transparent;
			border: none;
			cursor: pointer;
			transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1);
		}

		@media (min-width: 640px) {
			.command-item {
				padding: 0.75rem 0.75rem;
			}
		}

		.command-item.selected {
			background: oklch(from var(--color-primary) l c h / 0.1);
			color: var(--color-text);
		}

		.command-item.selected .command-item-icon {
			background: var(--color-primary);
			color: oklch(0 0 0 / 0.8);  
			opacity: 1;
		}

		.command-item:active {
			transform: scale(0.995);
		}

		.command-item-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 1.5rem;
			height: 1.5rem;
			border-radius: 0.25rem;
			background: oklch(from var(--color-text) l c h / 0.05);
			color: var(--color-text);
			opacity: 0.7;
			transition: all 150ms ease;
		}

		.command-item-title {
			flex: 1;
			font-size: 0.9375rem;
			font-weight: 500;
			letter-spacing: -0.01em;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		 

		.command-item-enter {
			opacity: 0;
			transform: translateX(-5px);
			transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
		}

		.command-item.selected .command-item-enter {
			opacity: 0.5;
			transform: translateX(0);
		}

		 
		 

		.command-results::-webkit-scrollbar {
			width: 6px;
		}

		.command-results::-webkit-scrollbar-track {
			background: transparent;
		}

		.command-results::-webkit-scrollbar-thumb {
			background: oklch(from var(--color-border) l c h / 0.3);
			border-radius: 3px;
		}

		.command-empty {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 3rem 1rem;
			text-align: center;
		}

		.command-empty-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 3rem;
			height: 3rem;
			margin-bottom: 1rem;
			border-radius: 0.375rem;
			background: oklch(from var(--color-surface) l c h / 0.5);
			color: var(--color-muted);
			border: 1px solid oklch(from var(--color-border) l c h / 0.3);
		}

		.command-empty-text {
			font-size: 0.875rem;
			color: var(--color-muted);
		}

		 

		.command-footer {
			display: none;
			align-items: center;
			justify-content: space-between;
			padding: 0.75rem 1.25rem;
			border-top: 1px solid oklch(from var(--color-border) l c h / 0.2);
			background: oklch(from var(--color-surface) l c h / 0.3);
			backdrop-filter: blur(10px);
		}

		@media (min-width: 640px) {
			.command-footer {
				display: flex;
			}
		}

		.command-hints {
			display: flex;
			align-items: center;
			gap: 1rem;
		}

		.command-hint {
			display: flex;
			align-items: center;
			gap: 0.375rem;
			font-size: 0.6875rem;
			color: var(--color-muted);
		}
	}
</style>
