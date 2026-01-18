<script lang="ts">
	import { page } from "$app/state";
	import { commandPalette } from "$lib/core/navigation/command-palette.svelte";
	import { cn } from "$lib/shared/merge-class";

	import { ui } from "$lib/stores/ui.svelte";
	import { Sparkles, Telescope, House, Library, FolderOpen, PanelLeft } from "@lucide/svelte";
	import { onMount } from "svelte";
	import CommandPalette from "./CommandPalette.svelte";

	let isSearchExpanded = $derived(commandPalette.isOpen);

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

	$effect(() => {
		if (isSearchExpanded) {
			isVisible = true;
		}
	});

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

<button
	type="button"
	class="floating-nav-backdrop"
	class:visible={isSearchExpanded}
	onclick={() => commandPalette.close()}
	onkeydown={(e) => e.key === "Escape" && commandPalette.close()}
	aria-label="Fechar busca"
	aria-hidden={!isSearchExpanded}
	tabindex={isSearchExpanded ? 0 : -1}
></button>

<nav
	class={cn("floating-nav", isVisible || isSearchExpanded ? "visible" : "hidden")}
	aria-label="Navegação principal"
>
	<div class="floating-nav-glow" class:expanded={isSearchExpanded}></div>

	<div class={cn("floating-nav-pill", isSearchExpanded && "expanded")}>
		<div class="floating-nav-content">
			<div class="nav-links" class:hidden={isSearchExpanded}>
				{#if page.url.pathname === "/"}
					<button
						type="button"
						class="nav-item active"
						onclick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
						aria-label="Ir para o topo"
					>
						<House size={18} class="nav-icon" />
						<span class="nav-label">Home</span>
					</button>
				{:else}
					<a href="/" class="nav-item" aria-label="Home">
						<House size={18} class="nav-icon" />
					</a>
				{/if}

				<button type="button" class="search-trigger" onclick={openSearch} aria-label="Buscar (⌘K)">
					<Sparkles size={16} class="search-icon" />
					<span class="search-text">Buscar</span>
					<kbd class="search-kbd">⌘K</kbd>
				</button>

				{#if isActive("/explore")}
					<a href="/explore" class="nav-item active" aria-label="Explorar">
						<Telescope size={18} class="nav-icon" />
						<span class="nav-label">Explorar</span>
					</a>
				{:else}
					<a href="/explore" class="nav-item" aria-label="Explorar">
						<Telescope size={18} class="nav-icon" />
					</a>
				{/if}

				{#if isActive("/series")}
					<a href="/series" class="nav-item active" aria-label="Séries">
						<Library size={18} class="nav-icon" />
						<span class="nav-label">Séries</span>
					</a>
				{:else}
					<a href="/series" class="nav-item" aria-label="Séries">
						<Library size={18} class="nav-icon" />
					</a>
				{/if}

				{#if isActive("/sets")}
					<a href="/sets" class="nav-item active" aria-label="Sets">
						<FolderOpen size={18} class="nav-icon" />
						<span class="nav-label">Sets</span>
					</a>
				{:else}
					<a href="/sets" class="nav-item" aria-label="Sets">
						<FolderOpen size={18} class="nav-icon" />
					</a>
				{/if}

				{#if page.url.pathname.startsWith("/posts/") && page.url.pathname !== "/posts"}
					<div class="mx-1 h-4 w-px bg-white/10"></div>
					<button
						type="button"
						class="nav-item"
						class:active={ui.sidebarVisible}
						onclick={() => ui.toggleSidebar()}
						aria-label={ui.sidebarVisible ? "Ocultar sidebar" : "Mostrar sidebar"}
					>
						<PanelLeft size={18} class="nav-icon" />
					</button>
				{/if}
			</div>

			<div class="command-palette-wrapper" class:hidden={!isSearchExpanded}>
				{#if isSearchExpanded}
					<CommandPalette />
				{/if}
			</div>
		</div>
	</div>
</nav>

<style>
	@layer components {
		/* ============================================
   * FLOATING NAV - Main Navigation Bar
   * ============================================ */

		.floating-nav-backdrop {
			position: fixed;
			inset: 0;
			z-index: 40;
			background: oklch(0 0 0 / 0.3);
			backdrop-filter: blur(12px);
			border: none;
			cursor: default;
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
			transition:
				opacity 200ms var(--motion-ease-out),
				visibility 200ms var(--motion-ease-out);
		}

		.floating-nav-backdrop.visible {
			opacity: 1;
			visibility: visible;
			pointer-events: auto;
		}

		.floating-nav {
			position: fixed;
			bottom: 1.5rem;
			left: 50%;
			z-index: 50;
			transform: translateX(-50%) translateY(0);
			opacity: 1;
			transition:
				transform 300ms var(--motion-ease-out-quint),
				opacity 150ms var(--motion-ease-out);
		}

		@media (min-width: 640px) {
			.floating-nav {
				bottom: 2rem;
			}
		}

		.floating-nav.hidden {
			transform: translateX(-50%) translateY(6rem);
			opacity: 0;
			pointer-events: none;
		}

		/* Glow Effect */
		.floating-nav-glow {
			position: absolute;
			inset: -0.5rem;
			z-index: -1;
			filter: blur(24px);
			opacity: 0.5;
			transition:
				transform 400ms var(--motion-ease-out-quint),
				opacity 400ms var(--motion-ease-out-quint);
		}

		.floating-nav-glow::before {
			content: "";
			display: block;
			width: 100%;
			height: 100%;
			border-radius: 9999px;
			background: linear-gradient(
				to right,
				oklch(from var(--color-accent) l c h / 0.6),
				oklch(from var(--color-primary) l c h / 0.7),
				oklch(from var(--color-accent) l c h / 0.6)
			);
			animation: floating-nav-pulse-glow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		}

		.floating-nav-glow.expanded {
			transform: scale(1.25);
			opacity: 0.8;
		}

		/* Pill Container */
		.floating-nav-pill {
			position: relative;
			display: flex;
			align-items: center;
			padding: 0.375rem;
			border-radius: 9999px;
			background: var(--material-thin);
			backdrop-filter: blur(24px) saturate(1.5);
			border: 1px solid oklch(from var(--color-border) l c h / 0.5);
			box-shadow:
				0 8px 32px oklch(0 0 0 / 0.12),
				0 2px 8px oklch(0 0 0 / 0.08);
			transition:
				width 400ms var(--motion-ease-out-quint),
				border-color 200ms var(--motion-ease);
		}

		:global(.dark) .floating-nav-pill {
			border-color: oklch(1 0 0 / 0.1);
		}

		.floating-nav-pill.expanded {
			width: min(520px, calc(100vw - 2rem));
		}

		/* Content Areas */
		.floating-nav-content {
			display: flex;
			align-items: center;
			width: 100%;
			position: relative;
		}

		.nav-links {
			display: flex;
			align-items: center;
			gap: 0.25rem;
			opacity: 1;
			transform: scale(1);
			transition:
				opacity 150ms var(--motion-ease-out),
				transform 150ms var(--motion-ease-out);
		}

		.nav-links.hidden {
			position: absolute;
			opacity: 0;
			transform: scale(0.96);
			pointer-events: none;
		}

		.command-palette-wrapper {
			width: 100%;
			opacity: 1;
			transform: scale(1);
			transition:
				opacity 200ms var(--motion-ease-out) 50ms,
				transform 200ms var(--motion-ease-out) 50ms;
		}

		.command-palette-wrapper.hidden {
			position: absolute;
			opacity: 0;
			transform: scale(0.96);
			pointer-events: none;
		}

		/* Navigation Items */
		.nav-item {
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 2.75rem;
			min-width: 2.75rem;
			padding: 0 0.625rem;
			border-radius: 9999px;
			color: var(--color-muted);
			text-decoration: none;
			border: none;
			background: transparent;
			cursor: pointer;
			transition: all 200ms var(--motion-ease-out);
		}

		.nav-item:hover {
			color: var(--color-text);
			background: var(--color-action-hover);
		}

		.nav-item:active {
			transform: scale(0.95);
		}

		.nav-item.active {
			gap: 0.5rem;
			padding: 0 1rem;
			color: var(--color-primary);
			background: oklch(from var(--color-primary) l c h / 0.15);
			box-shadow: inset 0 0 0 1px oklch(from var(--color-primary) l c h / 0.2);
		}

		.nav-item :global(.nav-icon) {
			flex-shrink: 0;
			transition: transform 200ms var(--motion-ease-out);
		}

		.nav-item:hover :global(.nav-icon) {
			transform: scale(1.1);
		}

		.nav-label {
			font-size: 10px;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.08em;
		}

		/* Search Trigger Button */
		.search-trigger {
			display: flex;
			align-items: center;
			gap: 0.625rem;
			min-height: 2.75rem;
			padding: 0 1rem;
			border-radius: 9999px;
			color: var(--color-text);
			font-size: 0.8125rem;
			font-weight: 500;
			letter-spacing: -0.01em;
			background: var(--color-action-hover);
			border: none;
			cursor: pointer;
			transition: all 200ms var(--motion-ease-out);
		}

		:global(.dark) .search-trigger {
			background: oklch(1 0 0 / 0.05);
		}

		.search-trigger:hover {
			color: var(--color-primary);
			background: oklch(1 0 0 / 0.15);
		}

		:global(.dark) .search-trigger:hover {
			background: oklch(1 0 0 / 0.1);
		}

		.search-trigger:active {
			transform: scale(0.97);
		}

		.search-trigger :global(.search-icon) {
			color: var(--color-primary);
			transition: all 200ms var(--motion-ease-out);
		}

		.search-trigger:hover :global(.search-icon) {
			transform: scale(1.1) rotate(12deg);
		}

		.search-text {
			display: none;
		}

		@media (min-width: 640px) {
			.search-text {
				display: inline;
			}
		}

		.search-kbd {
			display: none;
			margin-left: 0.25rem;
			padding: 0.125rem 0.375rem;
			font-family: var(--font-mono);
			font-size: 10px;
			color: var(--color-muted);
			background: oklch(from var(--color-surface) l c h / 0.5);
			border: 1px solid oklch(from var(--color-border) l c h / 0.5);
			border-radius: 0.25rem;
		}

		@media (min-width: 640px) {
			.search-kbd {
				display: inline;
			}
		}

		/* ============================================
   * KEYFRAMES
   * ============================================ */

		@keyframes floating-nav-fade-in {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}

		@keyframes floating-nav-pulse-glow {
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
	}
</style>
