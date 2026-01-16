<script lang="ts">
	import { page } from "$app/state";
	import { commandPalette } from "$lib/stores/command-palette.svelte";
	import { cn } from "$lib/utils/merge-class";

	import { Sparkles, Telescope, House, Library, FolderOpen } from "@lucide/svelte";
	import { fade, scale } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
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
		class="fixed inset-0 z-40 bg-black/30 backdrop-blur-md transition-all duration-400"
		onclick={() => commandPalette.close()}
		onkeydown={(e) => e.key === "Escape" && commandPalette.close()}
		role="button"
		tabindex="-1"
		aria-label="Fechar busca"
		transition:fade={{ duration: 250, easing: cubicOut }}
	></div>
{/if}

<!-- Floating Navigation -->
<nav
	class={cn(
		"fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ease-[var(--motion-ease-out-quint)] sm:bottom-8",
		isVisible || isSearchExpanded ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
	)}
	aria-label="Navegação principal"
>
	<!-- Glow Effect (Premium) -->
	<div
		class={cn(
			"pointer-events-none absolute -inset-2 -z-10 blur-3xl transition-all duration-700 ease-[var(--motion-ease-out-quint)]",
			isSearchExpanded ? "scale-125 opacity-80" : "scale-100 opacity-50"
		)}
	>
		<div
			class="from-accent/60 via-primary/70 to-accent/60 animate-pulse-slow h-full w-full rounded-full bg-gradient-to-r"
		></div>
	</div>

	<!-- Navigation Pill (Premium Glassmorphism) -->
	<div
		class={cn(
			"relative flex items-center rounded-full p-1.5 transition-all duration-500 ease-[var(--motion-ease-out-quint)]",
			"bg-material-thin backdrop-blur-2xl backdrop-saturate-150",
			"border border-white/15 dark:border-white/10",
			"shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]",
			"ring-1 ring-white/10 dark:ring-white/5",
			isSearchExpanded ? "w-[min(520px,calc(100vw-2rem))]" : "w-auto min-w-max"
		)}
	>
		{#if !isSearchExpanded}
			<!-- Collapsed State: Navigation Icons -->
			<div
				class="flex items-center gap-1"
				in:scale={{ duration: 250, delay: 50, easing: cubicOut }}
			>
				<!-- Home -->
				{#if page.url.pathname === "/"}
					<button
						type="button"
						class="group bg-primary/15 text-primary ring-primary/20 hover:bg-primary/20 flex h-10 items-center gap-2 rounded-full px-4 ring-1 transition-all duration-200 ease-out active:scale-[0.97]"
						onclick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
						aria-label="Ir para o topo"
					>
						<House
							size={18}
							class="shrink-0 transition-transform duration-200 group-hover:scale-110"
						/>
						<span class="text-[10px] font-semibold tracking-[0.08em] uppercase">Home</span>
					</button>
				{:else}
					<a
						href="/"
						class="group text-muted hover:text-text hover:bg-action-hover flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ease-out active:scale-[0.95]"
						aria-label="Home"
					>
						<House size={18} class="transition-transform duration-200 group-hover:scale-110" />
					</a>
				{/if}

				<!-- Search Trigger Button -->
				<button
					type="button"
					class="group text-text hover:text-primary bg-action-hover flex h-10 items-center gap-2.5 rounded-full px-4 text-sm font-medium transition-all duration-200 ease-out hover:bg-white/15 active:scale-[0.97] dark:bg-white/5 dark:hover:bg-white/10"
					onclick={openSearch}
					aria-label="Buscar (⌘K)"
				>
					<Sparkles
						size={16}
						class="text-primary transition-all duration-200 group-hover:scale-110 group-hover:rotate-12"
					/>
					<span class="hidden text-[13px] tracking-tight sm:inline">Buscar</span>
					<kbd
						class="border-border/50 bg-surface/50 text-muted ml-1 hidden rounded border px-1.5 py-0.5 font-mono text-[10px] sm:inline"
						>⌘K</kbd
					>
				</button>

				<!-- Explore -->
				{#if isActive("/explore")}
					<a
						href="/explore"
						class="group bg-primary/15 text-primary ring-primary/20 hover:bg-primary/20 flex h-10 items-center gap-2 rounded-full px-4 ring-1 transition-all duration-200 ease-out active:scale-[0.97]"
						aria-label="Explorar"
					>
						<Telescope
							size={18}
							class="shrink-0 transition-transform duration-200 group-hover:scale-110"
						/>
						<span class="text-[10px] font-semibold tracking-[0.08em] uppercase">Explorar</span>
					</a>
				{:else}
					<a
						href="/explore"
						class="group text-muted hover:text-text hover:bg-action-hover flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ease-out active:scale-[0.95]"
						aria-label="Explorar"
					>
						<Telescope size={18} class="transition-transform duration-200 group-hover:scale-110" />
					</a>
				{/if}

				<!-- Series -->
				{#if isActive("/series")}
					<a
						href="/series"
						class="group bg-primary/15 text-primary ring-primary/20 hover:bg-primary/20 flex h-10 items-center gap-2 rounded-full px-4 ring-1 transition-all duration-200 ease-out active:scale-[0.97]"
						aria-label="Séries"
					>
						<Library
							size={18}
							class="shrink-0 transition-transform duration-200 group-hover:scale-110"
						/>
						<span class="text-[10px] font-semibold tracking-[0.08em] uppercase">Séries</span>
					</a>
				{:else}
					<a
						href="/series"
						class="group text-muted hover:text-text hover:bg-action-hover flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ease-out active:scale-[0.95]"
						aria-label="Séries"
					>
						<Library size={18} class="transition-transform duration-200 group-hover:scale-110" />
					</a>
				{/if}

				<!-- Topics -->
				{#if isActive("/topics")}
					<a
						href="/topics"
						class="group bg-primary/15 text-primary ring-primary/20 hover:bg-primary/20 flex h-10 items-center gap-2 rounded-full px-4 ring-1 transition-all duration-200 ease-out active:scale-[0.97]"
						aria-label="Tópicos"
					>
						<FolderOpen
							size={18}
							class="shrink-0 transition-transform duration-200 group-hover:scale-110"
						/>
						<span class="text-[10px] font-semibold tracking-[0.08em] uppercase">Tópicos</span>
					</a>
				{:else}
					<a
						href="/topics"
						class="group text-muted hover:text-text hover:bg-action-hover flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ease-out active:scale-[0.95]"
						aria-label="Tópicos"
					>
						<FolderOpen size={18} class="transition-transform duration-200 group-hover:scale-110" />
					</a>
				{/if}
			</div>
		{:else}
			<!-- Expanded State: Search Input -->
			<div
				class="w-full"
				in:scale={{ duration: 300, delay: 100, easing: cubicOut }}
				out:fade={{ duration: 150 }}
			>
				<CommandPalette />
			</div>
		{/if}
	</div>
</nav>

<style>
	/* Premium glow animation */
	:global(.animate-pulse-slow) {
		animation: pulse-glow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse-glow {
		0%,
		100% {
			opacity: 0.5;
			transform: scale(1);
		}
		50% {
			opacity: 0.7;
			transform: scale(1.05);
		}
	}
</style>
