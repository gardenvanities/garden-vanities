<script lang="ts">
	import { commandPalette } from "$lib/core/navigation/command-palette.svelte.js";
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
	import { setTheme } from "$lib/core/theme/theme.svelte";
	import { cn } from "$lib/shared/merge-class";
	import Fuse from "fuse.js";
	import {
		Home,
		Telescope,
		BookOpen,
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
		{ id: "home", title: "Ir para Home", icon: Home, type: "navigation", category: "Navegação", action: () => navigate("/") },
		{ id: "explore", title: "Explorar Jardim", icon: Telescope, type: "navigation", category: "Navegação", action: () => navigate("/explore") },
		{ id: "posts", title: "Ver Artigos", icon: BookOpen, type: "navigation", category: "Navegação", action: () => navigate("/posts") }
	];

	const themeActions: CommandItem[] = [
		{ id: "theme-light", title: "Tema Claro", icon: Sun, type: "action", category: "Aparência", action: () => updateTheme("light") },
		{ id: "theme-dark", title: "Tema Escuro", icon: Moon, type: "action", category: "Aparência", action: () => updateTheme("dark") },
		{ id: "theme-system", title: "Tema do Sistema", icon: Monitor, type: "action", category: "Aparência", action: () => updateTheme("system") }
	];

	const staticActions: CommandItem[] = [...navigationActions, ...themeActions];

	const searchableData = $derived([
		...staticActions,
		...searchIndex.map((p) => ({
			id: p.slug,
			title: p.title,
			icon: FileText,
			type: "post" as const,
			category: "Artigos",
			kind: p.kind,
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
		if (!q) return searchableData.slice(0, 8); // Show top 8 when empty
		const results = fuse.search(q);
		return results.map((r) => r.item);
	});

	// Group results by category
	const groupedResults = $derived.by(() => {
		const groups: Record<string, CommandItem[]> = {};
		for (const item of filteredResults) {
			const cat = item.category || "Outros";
			if (!groups[cat]) groups[cat] = [];
			groups[cat].push(item);
		}
		return groups;
	});

	// Flat index for keyboard navigation
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

<div class="command-container">
	<!-- Search Input -->
	<div class="command-header">
		<div class="command-search-icon">
			<Sparkles size={18} strokeWidth={2} />
		</div>
		<input
			bind:this={searchInputElement}
			bind:value={query}
			type="text"
			placeholder="Buscar artigos, ações..."
			class="command-input"
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

	<!-- Results -->
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
			{#each Object.entries(groupedResults) as [category, items]}
				{@const CategoryIcon = getCategoryIcon(category)}
				<div class="command-group">
					<div class="command-group-header">
						<CategoryIcon size={12} strokeWidth={2} />
						<span>{category}</span>
					</div>
					<div class="command-group-items">
						{#each items as item}
							{@const globalIndex = flatResults.indexOf(item)}
							<button
								class={cn(
									"command-item",
									selectedIndex === globalIndex && "selected"
								)}
								onclick={item.action}
								data-command-index={globalIndex}
							>
								<div class="command-item-icon">
									<item.icon size={16} strokeWidth={2} />
								</div>
								<span class="command-item-title">{item.title}</span>
								{#if item.kind}
									<span class="command-item-badge">{item.kind}</span>
								{/if}
								{#if selectedIndex === globalIndex}
									<CornerDownLeft class="command-item-enter" size={14} strokeWidth={2} />
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<!-- Footer -->
	<div class="command-footer">
		<div class="command-hints">
			<span class="command-hint">
				<kbd>↑↓</kbd>
				<span>navegar</span>
			</span>
			<span class="command-hint">
				<kbd>↵</kbd>
				<span>selecionar</span>
			</span>
		</div>
		<span class="command-hint">
			<kbd>esc</kbd>
			<span>fechar</span>
		</span>
	</div>
</div>

<style>
	@layer components {
		/* ============================================
		 * COMMAND CONTAINER
		 * ============================================ */

		.command-container {
			display: flex;
			flex-direction: column;
			overflow: hidden;
			border-radius: 1rem;
			background: oklch(from var(--color-surface-elevated) l c h / 0.8);
			backdrop-filter: blur(20px);
			-webkit-backdrop-filter: blur(20px);
			border: 1px solid oklch(from var(--color-border) l c h / 0.4);
			box-shadow:
				0 0 0 1px oklch(255 255 255 / 0.05),
				0 24px 48px -12px oklch(0 0 0 / 0.2),
				0 48px 100px -24px oklch(0 0 0 / 0.2);
			max-height: calc(100dvh - 2rem);
			transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		}

		:global(.dark) .command-container {
			background: oklch(from var(--color-surface-elevated) l c h / 0.7);
			border-color: oklch(255 255 255 / 0.1);
			box-shadow:
				0 0 0 1px oklch(255 255 255 / 0.05),
				0 0 0 1px oklch(0 0 0 / 1),
				0 24px 48px -12px oklch(0 0 0 / 0.5);
		}

		/* ============================================
		 * HEADER / SEARCH INPUT
		 * ============================================ */

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
			border-radius: 0.375rem;
			color: var(--color-muted);
			background: transparent;
			border: none;
			cursor: pointer;
			transition: all 150ms var(--motion-ease);
		}

		.command-close:hover {
			color: var(--color-text);
			background: oklch(from var(--color-text) l c h / 0.05);
		}

		/* ============================================
		 * RESULTS
		 * ============================================ */

		.command-results {
			flex: 1;
			min-height: 0;
			overflow-y: auto;
			padding: 0.5rem;
			scrollbar-width: thin;
			scrollbar-color: oklch(from var(--color-border) l c h / 0.3) transparent;
		}

		/* ============================================
		 * GROUP
		 * ============================================ */

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

		/* ============================================
		 * ITEM
		 * ============================================ */

		.command-item {
			display: flex;
			align-items: center;
			gap: 0.75rem;
			width: 100%;
			padding: 0.75rem 0.75rem;
			border-radius: 0.5rem;
			color: var(--color-text);
			text-align: left;
			background: transparent;
			border: none;
			cursor: pointer;
			transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1);
		}

		.command-item.selected {
			background: oklch(from var(--color-primary) l c h / 0.1);
			color: var(--color-text);
		}

		.command-item.selected .command-item-icon {
			background: var(--color-primary);
			color: oklch(0 0 0 / 0.8); /* Dark icon on primary */
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
			border-radius: 0.375rem;
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

		.command-item-badge {
			display: inline-flex;
			align-items: center;
			padding: 0 0.5em;
			height: 1.25em;
			border-radius: 99px;
			font-size: 0.625rem;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			background: oklch(from var(--color-border) l c h / 0.5);
			color: var(--color-muted);
			margin-left: 0.5rem;
			border: 1px solid oklch(from var(--color-border) l c h / 0.5);
		}

		.command-item.selected .command-item-badge {
			background: oklch(from var(--color-primary) l c h / 0.2);
			color: var(--color-text);
			border-color: oklch(from var(--color-primary) l c h / 0.3);
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

		/* ============================================
		 * EMPTY STATE & SCROLLBAR
		 * ============================================ */
		/* ... (Keeping existing scrollbar and empty styles, omitted for brevity if unchanged, but included here for full replace) */
		
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
			border-radius: 1rem;
			background: oklch(from var(--color-surface) l c h / 0.5);
			color: var(--color-muted);
			border: 1px solid oklch(from var(--color-border) l c h / 0.3);
		}

		.command-empty-text {
			font-size: 0.875rem;
			color: var(--color-muted);
		}
		
		/* ============================================
		 * FOOTER
		 * ============================================ */

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

		.command-hint kbd {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			min-width: 1.25rem;
			height: 1.25rem;
			padding: 0 0.25rem;
			font-family: var(--font-mono);
			font-size: 0.625rem;
			font-weight: 500;
			color: var(--color-text);
			background: oklch(from var(--color-surface) l c h / 0.5);
			border: 1px solid oklch(from var(--color-border) l c h / 0.5);
			border-radius: 0.25rem;
			box-shadow: 0 1px 1px oklch(0 0 0 / 0.05);
		}
	}
</style>
