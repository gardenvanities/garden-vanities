<script lang="ts">
	import { page } from "$app/state";
	import { commandPalette } from "$lib/stores/command-palette.svelte.js";

	import { Folder, Sparkles, Telescope } from "@lucide/svelte";
	import { fade } from "svelte/transition";
	import { onMount } from "svelte";
	import CommandPalette from "./CommandPalette.svelte";

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
	class={[
		"fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ease-in-out sm:bottom-8",
		isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
	].join(" ")}
	aria-label="Navegação principal"
>
	<!-- Glow Effect -->
	<div
		class="pointer-events-none absolute inset-0 -z-10 opacity-60 blur-2xl transition-all duration-500"
		class:scale-110={isSearchExpanded}
	>
		<div
			class="from-primary/40 via-primary/30 to-accent/40 h-full w-full rounded-full bg-linear-to-r"
		></div>
	</div>

	<!-- Navigation Pill -->
	<div
		class={[
			"bg-surface/90 relative flex min-w-max items-center gap-1 rounded-full border border-white/20 px-2 py-2 shadow-2xl shadow-black/10 backdrop-blur-xl transition-all duration-500 ease-out dark:border-white/10",
			isSearchExpanded ? "w-[min(500px,calc(100vw-2rem))]" : "w-auto"
		].join(" ")}
	>
		{#if !isSearchExpanded}
			<!-- Collapsed State: Navigation Icons -->
			<div class="flex items-center gap-1" in:fade={{ duration: 200, delay: 100 }}>
				<!-- Home -->
				{#if page.url.pathname === "/"}
					<button
						type="button"
						class="text-primary group hover:bg-action-hover flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200"
						onclick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
						aria-label="Ir para o topo"
					>
						<Telescope size={20} class="transition-transform group-hover:scale-110" />
					</button>
				{:else}
					<a
						href="/"
						class="text-muted hover:text-text group hover:bg-action-hover flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200"
						aria-label="Home"
					>
						<Telescope size={20} class="transition-transform group-hover:scale-110" />
					</a>
				{/if}

				<!-- Search Trigger Button -->
				<button
					type="button"
					class="text-text group bg-surface-elevated hover:bg-action-hover hover:text-primary flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300"
					onclick={openSearch}
					aria-label="Buscar"
				>
					<Sparkles
						size={16}
						class="text-primary transition-transform group-hover:scale-110 group-hover:rotate-12"
					/>
					<span class="hidden sm:inline">Buscar</span>
				</button>

				<!-- Posts/Grid -->
				<a
					href="/posts"
					class={[
						"text-muted hover:text-text group hover:bg-action-hover flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200",
						isActive("/posts") ? "text-primary" : ""
					].join(" ")}
					aria-label="Artigos"
				>
					<Folder size={20} class="transition-transform group-hover:scale-110" />
				</a>
			</div>
		{:else}
			<!-- Expanded State: Search Input (CommandPalette) -->
			<div class="w-full" in:fade={{ duration: 200, delay: 50 }} out:fade={{ duration: 100 }}>
				<CommandPalette />
			</div>
		{/if}
	</div>
</nav>
