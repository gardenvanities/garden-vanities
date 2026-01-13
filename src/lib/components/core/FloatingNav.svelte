<script lang="ts">
	import { page } from "$app/state";
	import { commandPalette } from "$lib/stores/command-palette.svelte.js";

	import { Folder, Sparkles, Telescope } from "@lucide/svelte";
	import { fade } from "svelte/transition";
	import { onMount } from "svelte";
	import CommandPalette from "./CommandPalette.svelte";

	interface SearchItem {
		title: string;
		slug: string;
		kind?: string;
		tags?: string[];
		content?: string;
	}

	let { searchIndex = [] }: { searchIndex?: SearchItem[] } = $props();

	// Sync local expanded state with store
	let isSearchExpanded = $derived(commandPalette.isOpen);

	// Global shortcut
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

	function openSearch() {
		commandPalette.open();
	}

	const isActive = (path: string) => {
		if (path === "/") return page.url.pathname === "/";
		return page.url.pathname.startsWith(path);
	};

	let isVisible = $state(true);
	let lastScrollY = $state(0);

	onMount(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			// Show if at top or scrolling up
			if (currentScrollY < 10 || currentScrollY < lastScrollY) {
				isVisible = true;
			}
			// Hide if scrolling down and not at top
			else if (currentScrollY > lastScrollY && currentScrollY > 10) {
				isVisible = isSearchExpanded; // Keep visible if search is open
			}

			lastScrollY = currentScrollY;
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return handleScroll; // Correct cleanup would be removing listener, but let's fix the logic below
	});

	// Fix cleanup properly
	$effect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			if (currentScrollY < 10 || currentScrollY < lastScrollY) {
				isVisible = true;
			} else if (currentScrollY > lastScrollY && currentScrollY > 10) {
				isVisible = isSearchExpanded;
			}
			lastScrollY = currentScrollY;
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	});
</script>

<!-- Floating Navigation -->
<nav
	class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ease-in-out sm:bottom-8 {isVisible
		? 'translate-y-0 opacity-100'
		: 'translate-y-24 opacity-0'}"
	aria-label="Navegação principal"
>
	<!-- Glow Effect -->
	<div
		class="pointer-events-none absolute inset-0 -z-10 opacity-60 blur-2xl transition-all duration-500"
		class:scale-110={isSearchExpanded}
	>
		<div
			class="h-full w-full rounded-full bg-linear-to-r from-purple-400/40 via-pink-400/40 to-rose-400/40"
		></div>
	</div>

	<!-- Navigation Pill -->
	<div
		class="relative flex min-w-max items-center gap-1 rounded-full border border-white/20 bg-white/90 px-2 py-2 shadow-2xl shadow-black/10 backdrop-blur-xl transition-all duration-500 ease-out dark:border-white/10 dark:bg-zinc-900/90 {isSearchExpanded
			? 'w-[min(500px,calc(100vw-2rem))]'
			: 'w-auto'}"
	>
		{#if !isSearchExpanded}
			<!-- Collapsed State: Navigation Icons -->
			<div class="flex items-center gap-1" in:fade={{ duration: 200, delay: 100 }}>
				<!-- Home -->
				{#if page.url.pathname === '/'}
					<button
						type="button"
						class="text-brand-primary! group flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10 dark:hover:text-white"
						onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
						aria-label="Ir para o topo"
					>
						<Telescope size={20} class="transition-transform group-hover:scale-110" />
					</button>
				{:else}
					<a
						href="/"
						class="text-text-muted hover:text-text-heading group flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10 dark:hover:text-white"
						aria-label="Home"
					>
						<Telescope size={20} class="transition-transform group-hover:scale-110" />
					</a>
				{/if}

				<!-- Search Trigger Button -->
				<button
					type="button"
					class="text-text-body group flex items-center gap-2 rounded-full bg-black/4 px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-pink-500/10 hover:text-pink-500 dark:bg-white/8 dark:text-white/80"
					onclick={openSearch}
					aria-label="Buscar"
				>
					<Sparkles
						size={16}
						class="text-pink-500 transition-transform group-hover:scale-110 group-hover:rotate-12"
					/>
					<span class="hidden sm:inline">Buscar</span>
				</button>

				<!-- Posts/Grid -->
				<a
					href="/posts"
					class="text-text-muted hover:text-text-heading group flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10 dark:hover:text-white {isActive(
						'/posts'
					)
						? 'text-brand-primary!'
						: ''}"
					aria-label="Artigos"
				>
					<Folder size={20} class="transition-transform group-hover:scale-110" />
				</a>
			</div>
		{:else}
			<!-- Expanded State: Search Input (CommandPalette) -->
			<div class="w-full" in:fade={{ duration: 200, delay: 50 }} out:fade={{ duration: 100 }}>
				<CommandPalette {searchIndex} />
			</div>
		{/if}
	</div>
</nav>
