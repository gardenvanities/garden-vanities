<script lang="ts">
	import { commandPalette } from "$lib/stores/command-palette.svelte.js";
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
	import { setTheme } from "$lib/stores/theme.svelte";
	import Fuse from "fuse.js";
	import { fly } from "svelte/transition";
	import { backOut } from "svelte/easing";
	import {
		Home,
		SearchCode,
		BookOpen,
		Sun,
		Moon,
		Monitor,
		FileText,
		CornerDownLeft
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

<!-- Results Popover -->
<div
	class="absolute bottom-full left-0 mb-5 w-full origin-bottom overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/95"
	transition:fly={{ y: 20, duration: 300, easing: backOut }}
>
	<div class="scrollbar-none max-h-[50vh] overflow-y-auto p-2">
		{#if filteredResults.length > 0}
			<div class="flex flex-col gap-1">
				{#each filteredResults as item, i (item.id)}
					<button
						class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors
							{selectedIndex === i
							? 'bg-pink-500/10 text-pink-600 dark:text-pink-400'
							: 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}"
						onclick={item.action}
						data-nav-index={i}
					>
						<div class="flex h-5 w-5 shrink-0 items-center justify-center">
							<item.icon size={18} />
						</div>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-medium">{item.title}</p>
							{#if item.type === "post"}
								<p class="truncate text-xs opacity-60">Artigo</p>
							{/if}
						</div>
						{#if selectedIndex === i}
							<CornerDownLeft class="shrink-0 opacity-50" size={14} />
						{/if}
					</button>
				{/each}
			</div>
		{:else if isLoading}
			<div class="flex animate-pulse flex-col items-center justify-center py-8 text-center">
				<SearchCode size={32} class="mb-2 text-zinc-300 dark:text-zinc-600" />
				<p class="text-sm text-zinc-500">Cultivando índice...</p>
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-8 text-center">
				<SearchCode size={32} class="mb-2 text-zinc-300 dark:text-zinc-600" />
				<p class="text-sm text-zinc-500">Nada encontrado</p>
			</div>
		{/if}
	</div>

	<!-- Footer Hints -->
	<div
		class="flex items-center justify-between border-t border-zinc-200/50 bg-zinc-50/50 px-3 py-2 text-[10px] text-zinc-400 dark:border-zinc-800/50 dark:bg-zinc-900/50"
	>
		<div class="flex gap-2">
			<span class="flex items-center gap-1"><kbd class="font-sans">↑↓</kbd> navegar</span>
			<span class="flex items-center gap-1"><kbd class="font-sans">↵</kbd> selecionar</span>
		</div>
		<div>
			<span class="flex items-center gap-1"><kbd class="font-sans">esc</kbd> fechar</span>
		</div>
	</div>
</div>

<!-- Input Area -->
<div class="flex w-full items-center gap-3 px-2">
	<!-- Note: Original had in:fade out:fade here. We should keep it or let parent handle? 
         If parent switches {#if}, it applies to the whole component. 
         But we want the INPUT to fade. The Popover flies. 
         So we can put fade on this div. -->
	<div class="shrink-0 text-pink-500">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-sparkles"
			><path
				d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
			/></svg
		>
	</div>
	<input
		bind:this={searchInputElement}
		bind:value={query}
		type="text"
		placeholder="Buscar artigos, temas..."
		class="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-white dark:placeholder:text-zinc-500"
		onkeydown={handleKeydown}
	/>
	<button
		type="button"
		class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
		onclick={closeSearch}
		aria-label="Fechar busca"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
		>
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
