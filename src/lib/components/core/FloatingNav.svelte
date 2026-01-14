<script lang="ts">
	import { page } from "$app/state";
	import { commandPalette } from "$lib/stores/command-palette.svelte.js";

	import { Sparkles, Telescope, House, Library, FolderOpen } from "@lucide/svelte";
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

	// Force visibility when search is expanded
	$effect(() => {
		if (isSearchExpanded) {
			isVisible = true;
		}
	});

	// Scroll management
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

<!-- Backdrop Overlay for Command Palette -->
{#if isSearchExpanded}
	<div
		class="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-all duration-300"
		onclick={() => commandPalette.close()}
		onkeydown={(e) => e.key === "Escape" && commandPalette.close()}
		role="button"
		tabindex="-1"
		aria-label="Fechar busca"
		transition:fade={{ duration: 300 }}
	></div>
{/if}

<!-- Floating Navigation -->
<nav
	class={[
		"fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ease-in-out sm:bottom-8",
		isVisible || isSearchExpanded ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
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
			"bg-surface/90 relative flex items-center rounded-full border border-white/20 p-1.5 shadow-2xl shadow-black/10 backdrop-blur-xl transition-all duration-500 ease-out dark:border-white/10",
			isSearchExpanded ? "w-[min(500px,calc(100vw-2rem))]" : "w-auto min-w-max"
		].join(" ")}
	>
		{#if !isSearchExpanded}
			<!-- Collapsed State: Navigation Icons -->
			<div class="flex items-center gap-1.5 px-0.5" in:fade={{ duration: 200, delay: 100 }}>
				<!-- Home -->
				{#if page.url.pathname === "/"}
					<button
						type="button"
						class="bg-primary/10 text-primary group flex h-10 items-center gap-2 rounded-full px-4 transition-all duration-300"
						onclick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
						aria-label="Ir para o topo"
					>
						<House size={18} class="shrink-0 transition-transform group-hover:scale-110" />
						<span class="text-xs font-bold tracking-wider uppercase">Home</span>
					</button>
				{:else}
					<a
						href="/"
						class="text-muted hover:text-text group hover:bg-action-hover flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200"
						aria-label="Home"
					>
						<House size={18} class="transition-transform group-hover:scale-110" />
					</a>
				{/if}

				<!-- Search Trigger Button -->
				<button
					type="button"
					class="text-text group bg-surface-elevated hover:bg-action-hover hover:text-primary flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all duration-300"
					onclick={openSearch}
					aria-label="Buscar"
				>
					<Sparkles
						size={16}
						class="text-primary transition-transform group-hover:scale-110 group-hover:rotate-12"
					/>
					<span class="hidden sm:inline">Buscar</span>
				</button>

				<!-- Explore/Library -->
				{#if isActive("/explore")}
					<a
						href="/explore"
						class="bg-primary/10 text-primary group flex h-10 items-center gap-2 rounded-full px-4 transition-all duration-300"
						aria-label="Explorar"
					>
						<Telescope size={18} class="shrink-0 transition-transform group-hover:scale-110" />
						<span class="text-xs font-bold tracking-wider uppercase">Explorar</span>
					</a>
				{:else}
					<a
						href="/explore"
						class="text-muted hover:text-text group hover:bg-action-hover flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200"
						aria-label="Explorar"
					>
						<Telescope size={18} class="transition-transform group-hover:scale-110" />
					</a>
				{/if}

				<!-- Series -->
				{#if isActive("/series")}
					<a
						href="/series"
						class="bg-primary/10 text-primary group flex h-10 items-center gap-2 rounded-full px-4 transition-all duration-300"
						aria-label="Séries"
					>
						<Library size={18} class="shrink-0 transition-transform group-hover:scale-110" />
						<span class="text-xs font-bold tracking-wider uppercase">Séries</span>
					</a>
				{:else}
					<a
						href="/series"
						class="text-muted hover:text-text group hover:bg-action-hover flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200"
						aria-label="Séries"
					>
						<Library size={18} class="transition-transform group-hover:scale-110" />
					</a>
				{/if}

				<!-- Topics/MoC -->
				{#if isActive("/topics")}
					<a
						href="/topics"
						class="bg-primary/10 text-primary group flex h-10 items-center gap-2 rounded-full px-4 transition-all duration-300"
						aria-label="Tópicos"
					>
						<FolderOpen size={18} class="shrink-0 transition-transform group-hover:scale-110" />
						<span class="text-xs font-bold tracking-wider uppercase">Tópicos</span>
					</a>
				{:else}
					<a
						href="/topics"
						class="text-muted hover:text-text group hover:bg-action-hover flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200"
						aria-label="Tópicos"
					>
						<FolderOpen size={18} class="transition-transform group-hover:scale-110" />
					</a>
				{/if}
			</div>
		{:else}
			<!-- Expanded State: Search Input (CommandPalette) -->
			<div class="w-full" in:fade={{ duration: 250, delay: 150 }} out:fade={{ duration: 150 }}>
				<CommandPalette />
			</div>
		{/if}
	</div>
</nav>
