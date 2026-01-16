<script lang="ts">
	import { commandPalette } from "$lib/stores/command-palette.svelte.js";
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
	import { setTheme } from "$lib/stores/theme.svelte";
	import { cn } from "$lib/utils/merge-class";
	import Fuse from "fuse.js";
	import { fly } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
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

	// No longer receiving props, fetching internally
	let searchIndex = $state<SearchItem[]>([]);
	let isLoading = $state(false);
	let hasLoaded = $state(false);

	let searchInputElement = $state<HTMLInputElement>();
	let query = $state("");
	let selectedIndex = $state(0);

	// Sync local expanded state with store
	let isSearchExpanded = $derived(commandPalette.isOpen);

	// Lazy load search index when opened
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
			threshold: 0.4,
			distance: 200,
			minMatchCharLength: 2,
			ignoreLocation: true,
			includeScore: true
		})
	);

	// Filtered results
	const filteredResults = $derived.by(() => {
		const q = query.trim();
		if (!q) return searchableData;
		const results = fuse.search(q);
		return results.map((r) => r.item);
	});

	// Reset selection when results change
	$effect(() => {
		void filteredResults.length;
		selectedIndex = 0;
	});

	// Focus input when expanded
	$effect(() => {
		if (isSearchExpanded) {
			setTimeout(() => searchInputElement?.focus(), 150);
		}
	});

	// Global shortcut handled in FloatingNav or Layout?
	// The original had it in FloatingNav. We can leave it there or move it.
	// For cleanliness, let's assume FloatingNav handles the shortcut to TOGGLE,
	// but once open, this component handles interaction.
	// Actually, the original onMount listener was for Ctrl+K. That should arguably belong to the global Nav or Layout.
	// Since FloatingNav is the main nav component, it makes sense there.
	// We won't duplicate the Ctrl+K listener here.

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

	// We can't handle the input keydown here because the input is in FloatingNav in the original design?
	// Wait, let's check the original design.
	// In FloatingNav.svelte:
	// The INPUT is in the "Expanded State: Search Input" block (lines 359+).
	// The POPOVER (results) is in lines 236+.

	// Issue: The Input and the Results were separate blocks in `FloatingNav`.
	// The results were `absolute bottom-full`.
	// The input was inside the `.nav-pill`.

	// Refactoring Challenge:
	// If I move the Results to `CommandPalette.svelte`, where does the Input go?
	// If `CommandPalette` contains BOTH the results popover AND the input, it might break the visual structure of "Input inside Pill, Results above Pill".

	// Option A: `CommandPalette` is ONLY the results popover.
	// Option B: `CommandPalette` is the whole search interface, but that requires rewriting the CSS layout significantly to allow one component to project into two places? No.

	// Looking at the original:
	// `force: true` for separation?

	// Actually, maybe I should just create the file `CommandPalette.svelte` as a wrapper for the WHOLE standard command palette experience (modal centered on screen), BUT the user designed a specific "Floating Nav Search".

	// If I just want to Fix the "File not found" error, I should create the file.
	// If I move ONLY the logic, I need to be careful about the Input.

	// In the original, `handleKeydown` (lines 178) is attached to the INPUT (line 371).
	// But `handleKeydown` manipulates `selectedIndex`, which controls the Results.

	// If I split them, I need to pass state/events.

	// Simpler approach:
	// Move EVERYTHING related to "Expanded Search" into `CommandPalette.svelte`?
	// The "Expanded State" replaces the "Nav Icons".

	// So `CommandPalette` could be the component that renders the *Expanded Pill Content* AND the *Results Popover*.
	// `FloatingNav` would just switch: `{#if isSearchExpanded} <CommandPalette /> {:else} <NavLinks /> {/if}`.

	// This seems viable!
	// `CommandPalette` would render:
	// 1. The Results Popover (absolute positioned relative to the pill)
	// 2. The Input Field (inside the pill flow)

	// Let's try to structure `CommandPalette.svelte` to output the Input Field as its main content, and the Popover as an absolute child.
	// Since `FloatingNav` wraps the content in `.nav-pill`, `CommandPalette` internal root would just be the fragment containing Input and Popover?
	// No, the Popover needs to be outside the `.nav-pill` overflow if it has `overflow: hidden`?
	// `FloatingNav` line 291: `.nav-pill` has `relative`. It does NOT have `overflow: hidden`.
	// The Popover (line 237) is `absolute bottom-full`. This works fine if it's a child of the pill content, provided the pill is positioned.
	// Wait, line 237 is OUTSIDE the pill in the original structure.
	// Original:
	// <nav>
	//   <Glow>
	//   <Results Popover> (absolute relative to nav)
	//   <div class="nav-pill">
	//     ... content ...
	//   </div>
	// </nav>

	// `nav` is fixed. `Results Popover` uses `absolute bottom-full` relative to `nav`.
	// `nav-pill` is inside `nav`.

	// If I put `CommandPalette` INSIDE `.nav-pill`, then `bottom-full` refers to the top of the pill?
	// Or I can change the positioning logic.

	// Let's stick to the architecture where `CommandPalette` encapsulates the *entire* search logic/view.
	// But `FloatingNav` controls the container.

	// I will make `CommandPalette.svelte` strictly the "Search Mode" UI.
	// It will emit `close` event? Or just use the store.

	// Note: `FloatingNav` lines 236-287 is the popover.
	// Lines 359-381 is the input.

	// I will combine them into `CommandPalette.svelte`.
	// Structure:
	// <>
	//   <Popover />
	//   <InputArea />
	// </>
	//
	// `FloatingNav` will look like:
	// <nav ...>
	//   ...
	//   <div class="nav-pill" ...>
	//     {#if !expanded}
	//        <Icons />
	//     {:else}
	//        <CommandPalette {searchIndex} />
	//     {/if}
	//   </div>
	// </nav>

	// Issue: The Popover in original was OUTSIDE `.nav-pill`.
	// If I put it inside `.nav-pill`, does it clip?
	// `.nav-pill` has no overflow hidden.
	// But `popover` was relative to `nav` (parent of pill).
	// If I put it in pill, `bottom-full` is relative to pill.
	// Since `nav` and `pill` share alignment (centered), it might modify the width?
	// `popover` (line 238) has `w-full`.
	// Inside `pill` (which expands to 500px), `w-full` will be 500px.
	// In `nav` (fixed, left-1/2), `nav` has width? `nav` is just a positioned wrapper.
	// `nav` has no width set.
	// `popover` line 238: `w-full`. If `nav` has no width, `w-full` might be 0?
	// Wait, `nav` contains `nav-pill`.
	// If `nav` is displayed as block? Flex?
	// `nav` class: `fixed bottom-6 left-1/2 ... -translate-x-1/2`.
	// It shrinks to content.
	// So `nav` width == `nav-pill` width.
	// Thus, putting Popover inside `CommandPalette` (inside Pill) vs outside Pill (in Nav) is effectively the same width context, IF `CommandPalette` takes up the full space.

	// However, `pill` has padding `px-2 py-2`.
	// If `CommandPalette` is inside pill, `bottom-full` starts at the top of the *content box* of the pill? Or padding box?
	// `absolute` is relative to padding box of nearest positioned ancestor (`nav-pill` is relative).
	// So `bottom-full` means top of the pill padding box.
	// In original, it was relative to `nav` which wraps everything. `nav` doesn't have padding.
	// But `nav` size matches pill.

	// It should look fine. `bottom-full` from inside the pill might be slightly lower (by `py-2` amount) than from outside?
	// `nav-pill` has `py-2`. `bottom-full` on a child moves it to the top edge of padding box.
	// `nav` (parent) wraps `nav-pill` tightly.
	// So `bottom-full` on a child of `nav` (sibling to pill) vs child of `pill` is roughly same.
	// I might need to adjust `mb-3` to `mb-5` if it looks too close.

	// Let's create `CommandPalette.svelte`.

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

<!-- Results Popover (Premium) -->
<div
	class="border-border-vivid/20 bg-surface-elevated/80 dark:border-border-vivid/15 absolute bottom-full left-0 mb-4 w-full origin-bottom overflow-hidden rounded-2xl border ring-1 shadow-[var(--shadow-depth-4)] ring-white/10 backdrop-blur-2xl backdrop-saturate-150 dark:ring-white/5"
	transition:fly={{ y: 16, duration: 400, easing: cubicOut }}
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

	<!-- Footer Hints (Premium KBD Styling) -->
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

<!-- Input Area (Premium) -->
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
		class="text-muted hover:text-text flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-action-hover transition-all duration-150 ease-out hover:bg-white/15 active:scale-95 dark:bg-white/5 dark:hover:bg-white/10"
		onclick={closeSearch}
		aria-label="Fechar busca (Esc)"
	>
		<X size={16} />
	</button>
</div>

<style>
	.scrollbar-none {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.scrollbar-none::-webkit-scrollbar {
		display: none;
	}
</style>
