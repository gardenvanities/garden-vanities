<script lang="ts">
	import { page } from "$app/state";
	import { commandPalette } from "$lib/core/navigation/command-palette.svelte";
	import { cn } from "$lib/shared/merge-class";
	import {
		Sparkles,
		Telescope,
		House,
		Layers,
		FolderOpen,
		LayoutGrid,
		X,
		Library
	} from "@lucide/svelte";
	import { onMount } from "svelte";
	import { fly, fade } from "svelte/transition";
	import CommandPalette from "./CommandPalette.svelte";
	import ReadingProgress from "$lib/modules/posts/components/ReadingProgress.svelte";
	import { readingProgress } from "$lib/stores/reading-progress.svelte";
	import { ui } from "$lib/stores/ui.svelte";

	let isSearchOpen = $derived(commandPalette.isOpen);
	let isMenuOpen = $state(false);

	onMount(() => {
		const listener = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				commandPalette.toggle();
			}
			if (e.key === "Escape" && isMenuOpen) {
				isMenuOpen = false;
			}
		};
		window.addEventListener("keydown", listener);
		return () => window.removeEventListener("keydown", listener);
	});

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}

	function openSearch() {
		commandPalette.open();
	}

	const isActive = (path: string) => {
		if (path === "/") return page.url.pathname === "/";
		return page.url.pathname.startsWith(path);
	};

	let isPostPage = $derived(
		page.url.pathname.startsWith("/posts/") && page.url.pathname !== "/posts"
	);

	$effect(() => {
		if (isPostPage) {
			const cleanup = readingProgress.init();
			return cleanup;
		}
	});

	let isVisible = $state(true);
	let lastScrollY = $state(0);

	$effect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			if (currentScrollY < 10 || currentScrollY < lastScrollY) {
				isVisible = true;
			} else if (currentScrollY > lastScrollY && currentScrollY > 10) {
				isVisible = isSearchOpen || isMenuOpen;
			}
			lastScrollY = currentScrollY;
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	});

	$effect(() => {
		if (isSearchOpen || isMenuOpen) {
			isVisible = true;
			// Block page scroll when menu or command palette is open
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	});

	// Hover magnification state
	let hoveredIndex = $state<number | null>(null);

	const navItems = [
		{ path: "/", icon: House, label: "Home" },
		{ path: "/explore", icon: Telescope, label: "Explorar" },
		{ path: "/series", icon: Layers, label: "Séries" },
		{ path: "/sets", icon: FolderOpen, label: "Sets" }
	];

	function getScale(index: number): number {
		if (hoveredIndex === null) return 1;
		const distance = Math.abs(index - hoveredIndex);
		if (distance === 0) return 1.25;
		if (distance === 1) return 1.1;
		return 1;
	}

	function handleHover(index: number) {
		if (window.matchMedia("(hover: hover)").matches) {
			hoveredIndex = index;
		}
	}

	const mobileGroups = [
		{
			title: "ARTIGOS",
			items: [
				{ path: "/explore", icon: Telescope, label: "Explorar" },
				{ path: "/series", icon: Layers, label: "Séries" },
				{ path: "/sets", icon: FolderOpen, label: "Coleções" }
			]
		},
		{
			title: "CONTEÚDO",
			items: [{ path: "/library", icon: Library, label: "Biblioteca" }]
		}
	];
</script>

<!-- Command Palette Modal Backdrop -->
{#if isSearchOpen}
	<button
		type="button"
		class="command-backdrop"
		onclick={() => commandPalette.close()}
		onkeydown={(e) => e.key === "Escape" && commandPalette.close()}
		aria-label="Fechar busca"
		tabindex={0}
	></button>
{/if}

<!-- Command Palette Modal -->
{#if isSearchOpen}
	<div class="command-modal">
		<CommandPalette />
	</div>
{/if}

<!-- Full Screen Mobile Menu -->
{#if isMenuOpen}
	<div class="menu-overlay" transition:fade={{ duration: 300 }}>
		<div class="menu-content">
			<button class="menu-close" onclick={closeMenu} aria-label="Fechar menu">
				<X size={20} strokeWidth={2} />
			</button>

			<nav class="menu-nav">
				{#each mobileGroups as group, g (group.title)}
					<div class="menu-group" transition:fly={{ y: 20, duration: 400, delay: 50 * g }}>
						<span class="menu-group-title">{group.title}</span>
						<div class="menu-group-items">
							{#each group.items as item (item.path)}
								<a
									href={item.path}
									class={cn("menu-link", isActive(item.path) && "active")}
									onclick={closeMenu}
								>
									<item.icon size={20} strokeWidth={2} />
									<span class="menu-label">{item.label}</span>
								</a>
							{/each}
						</div>
					</div>
				{/each}
			</nav>
		</div>
	</div>
{/if}

<!-- Floating Navigation Dock -->
<nav class="floating-dock" aria-label="Navegação principal">
	<div class={cn("dock-container", isVisible ? "visible" : "hidden")}>
		<!-- Dock Items -->
		<div class="dock-nav">
			<!-- Mobile: Menu Toggle -->
			<button
				type="button"
				class={cn("dock-item lg:hidden", isMenuOpen && "active")}
				onclick={toggleMenu}
				aria-label="Menu"
			>
				<LayoutGrid size={20} strokeWidth={2} />
				{#if !isMenuOpen}<span class="dock-indicator"></span>{/if}
			</button>

			<!-- Desktop: Home -->
			<a
				href="/"
				class={cn("dock-item hidden lg:flex", isActive(navItems[0].path) && "active")}
				style="--scale: {getScale(0)}"
				onmouseenter={() => handleHover(0)}
				onmouseleave={() => (hoveredIndex = null)}
				onclick={(e) => {
					if (isActive("/")) {
						e.preventDefault();
						window.scrollTo({ top: 0, behavior: "smooth" });
					}
				}}
				aria-label={navItems[0].label}
			>
				<House size={20} strokeWidth={2} />
				{#if isActive(navItems[0].path)}<span class="dock-indicator"></span>{/if}
			</a>

			<!-- Desktop: Links -->
			{#each navItems.slice(1, 4) as item, i (item.path)}
				{@const index = i + 1}
				{@const scale = getScale(index)}
				<a
					href={item.path}
					class={cn("dock-item hidden lg:flex", isActive(item.path) && "active")}
					style="--scale: {scale}"
					onmouseenter={() => handleHover(index)}
					onmouseleave={() => (hoveredIndex = null)}
					aria-label={item.label}
				>
					<item.icon size={20} strokeWidth={2} />
					<span class="dock-tooltip">{item.label}</span>
					{#if isActive(item.path)}
						<span class="dock-indicator"></span>
					{/if}
				</a>
			{/each}
		</div>

		<!-- Divider -->
		<div class="dock-divider"></div>

		<!-- Search Button -->
		<button type="button" class="dock-search" onclick={openSearch} aria-label="Buscar (⌘K)">
			<div class="search-icon-wrapper">
				<Sparkles size={16} strokeWidth={2} />
			</div>
			<span class="search-label">Buscar</span>
			<kbd class="search-kbd">⌘K</kbd>
		</button>
		<!-- Reading Progress (Visible on Post Pages) -->
		<!-- Reading Progress Ring (Only on Post Pages) -->
		{#if isPostPage}
			<div class="dock-divider"></div>

			<button
				type="button"
				class="dock-item"
				style="--scale: {getScale(10)}"
				onmouseenter={() => handleHover(10)}
				onmouseleave={() => (hoveredIndex = null)}
				onclick={() => ui.toggleSidebar()}
				aria-label="Abrir Índice"
			>
				<ReadingProgress progress={readingProgress.percent} class="absolute inset-0" />
				<span class="dock-tooltip">Índice</span>
			</button>
		{/if}
	</div>
</nav>

<style>
	@layer components {
		/* ============================================
		 * MENU OVERLAY (MOBILE)
		 * ============================================ */
		.menu-overlay {
			position: fixed;
			inset: 0;
			height: 100dvh;
			z-index: 1000;
			background: oklch(from var(--color-surface) l c h / 0.8);
			backdrop-filter: blur(40px) saturate(2);
			display: flex;
			flex-direction: column;
		}

		.menu-content {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 1.5rem;
			position: relative;
			height: 100%;
		}

		.menu-close {
			position: absolute;
			top: auto;
			bottom: 1.5rem;
			right: 1.5rem;
			width: 3rem;
			height: 3rem;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: oklch(from var(--color-surface) l c h / 0.5);
			backdrop-filter: blur(12px);
			border: 1px solid oklch(from var(--color-border) l c h / 0.2);
			box-shadow: 0 4px 12px oklch(0 0 0 / 0.1);
			color: var(--color-text);
			cursor: pointer;
			transition: all 200ms var(--motion-ease-out);
			z-index: 20;
		}

		.menu-close:active {
			transform: scale(0.9);
			background: oklch(from var(--color-text) l c h / 0.1);
		}

		.menu-nav {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			gap: 1.5rem;
			padding-bottom: 5rem;
		}

		.menu-group {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}

		.menu-group-title {
			font-size: 0.75rem;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.1em;
			color: var(--color-muted);
			padding-left: 1rem;
			opacity: 0.8;
			margin-bottom: 0.25rem;
		}

		.menu-group-items {
			display: flex;
			flex-direction: column;
			gap: 0.125rem;
		}

		.menu-link {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			gap: 0.75rem;
			padding: 0.5rem 0.75rem;
			border-radius: 0.75rem;
			text-decoration: none;
			color: var(--color-text);
			background: transparent;
			transition: all 200ms var(--motion-ease-out);
			border: 1px solid transparent;
		}

		.menu-link .menu-label {
			font-size: 1.125rem;
			font-weight: 600;
			letter-spacing: -0.01em;
			transition: color 200ms ease;
		}

		.menu-link.active {
			background: oklch(from var(--color-primary) l c h / 0.05);
			border-color: oklch(from var(--color-primary) l c h / 0.1);
		}

		.menu-link.active .menu-label,
		.menu-link.active :global(svg) {
			color: var(--color-primary);
		}

		.menu-link:active {
			transform: scale(0.98);
			background: oklch(from var(--color-text) l c h / 0.05);
		}

		@media (hover: hover) {
			.menu-link:hover .menu-label {
				color: var(--color-primary);
			}
		}

		/* ============================================
		 * COMMAND PALETTE MODAL
		 * ============================================ */

		.command-backdrop {
			position: fixed;
			inset: 0;
			z-index: 90;
			background: oklch(0 0 0 / 0.6);
			backdrop-filter: blur(8px);
			border: none;
			cursor: default;
			animation: fade-in 200ms var(--motion-ease-out) forwards;
		}

		.command-modal {
			position: fixed;
			top: 1rem;
			left: 50%;
			transform: translateX(-50%);
			z-index: 100;
			width: min(560px, calc(100vw - 2rem));
			max-height: calc(100dvh - 2rem);
			display: flex;
			flex-direction: column;
			animation: modal-in 250ms var(--motion-ease-out-quint) forwards;
		}

		@media (min-width: 640px) {
			.command-modal {
				top: 20%;
				max-height: 70dvh;
			}
		}

		@keyframes modal-in {
			from {
				opacity: 0;
				transform: translateX(-50%) translateY(8px) scale(0.96);
			}
			to {
				opacity: 1;
				transform: translateX(-50%) translateY(0) scale(1);
			}
		}

		@keyframes fade-in {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}

		/* ============================================
		 * FLOATING DOCK
		 * ============================================ */

		.floating-dock {
			position: fixed;
			bottom: 1.25rem;
			left: 50%;
			z-index: 50;
			transform: translateX(-50%) translateY(0);
			display: flex;
			align-items: center;
			gap: 0.75rem;
			opacity: 1;
			transition:
				transform 350ms var(--motion-ease-out-quint),
				opacity 200ms var(--motion-ease-out);
		}

		@media (min-width: 640px) {
			.floating-dock {
				bottom: 1.75rem;
			}
		}

		.dock-container {
			display: flex;
			align-items: center;
			gap: 0.25rem;
			padding: 0.5rem;
			border-radius: 1.25rem;
			background: oklch(from var(--color-surface) calc(l * 1.05) c h / 0.85);
			backdrop-filter: blur(24px) saturate(1.8);
			border: 1px solid oklch(1 0 0 / 0.12);
			box-shadow:
				0 0 0 1px oklch(0 0 0 / 0.03),
				0 8px 40px oklch(0 0 0 / 0.15),
				0 2px 12px oklch(0 0 0 / 0.08);
			transform: translateY(0);
			opacity: 1;
			transition:
				transform 350ms var(--motion-ease-out-quint),
				opacity 200ms var(--motion-ease-out);
		}

		.dock-container.hidden {
			transform: translateY(calc(100% + 2rem));
			opacity: 0;
			pointer-events: none;
		}

		:global(.dark) .dock-container {
			background: oklch(from var(--color-surface) calc(l * 0.8) c h / 0.75);
			border-color: oklch(1 0 0 / 0.08);
		}

		/* ============================================
		 * NAV SECTION
		 * ============================================ */

		.dock-nav {
			display: flex;
			align-items: center;
			gap: 0.125rem;
		}

		.dock-item {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 2.75rem;
			height: 2.75rem;
			border-radius: 0.875rem;
			color: var(--color-muted);
			text-decoration: none;
			border: none;
			background: transparent;
			cursor: pointer;
			transform: scale(var(--scale, 1));
			transform-origin: bottom center;
			transition:
				transform 200ms var(--motion-ease-out),
				color 150ms var(--motion-ease),
				background 150ms var(--motion-ease);
		}

		@media (hover: hover) {
			.dock-item:hover {
				color: var(--color-text);
			}
		}

		.dock-item:active {
			transform: scale(calc(var(--scale, 1) * 0.92));
		}

		.dock-item.active {
			color: var(--color-primary);
			background: oklch(from var(--color-primary) l c h / 0.12);
		}

		/* Tooltip */
		.dock-tooltip {
			position: absolute;
			bottom: calc(100% + 0.75rem);
			left: 50%;
			transform: translateX(-50%) translateY(4px);
			padding: 0.375rem 0.625rem;
			font-size: 0.6875rem;
			font-weight: 600;
			letter-spacing: 0.02em;
			white-space: nowrap;
			color: var(--color-text);
			background: var(--color-surface-elevated);
			border: 1px solid oklch(from var(--color-border) l c h / 0.5);
			border-radius: 0.5rem;
			box-shadow: 0 4px 12px oklch(0 0 0 / 0.15);
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
			transition:
				opacity 150ms var(--motion-ease),
				transform 150ms var(--motion-ease),
				visibility 150ms var(--motion-ease);
		}

		@media (hover: hover) {
			.dock-item:hover .dock-tooltip {
				opacity: 1;
				visibility: visible;
				transform: translateX(-50%) translateY(0);
			}
		}

		/* Active Indicator Dot */
		.dock-indicator {
			position: absolute;
			bottom: 0.25rem;
			left: 50%;
			transform: translateX(-50%);
			width: 4px;
			height: 4px;
			border-radius: 50%;
			background: var(--color-primary);
			box-shadow: 0 0 8px oklch(from var(--color-primary) l c h / 0.6);
		}

		/* ============================================
		 * DIVIDER
		 * ============================================ */

		.dock-divider {
			width: 1px;
			height: 1.5rem;
			margin: 0 0.375rem;
			background: oklch(from var(--color-border) l c h / 0.4);
		}

		/* ============================================
		 * SEARCH BUTTON
		 * ============================================ */

		/* ============================================
		 * SEARCH BUTTON
		 * ============================================ */

		.dock-search {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;
			width: auto;
			height: 2.5rem;
			padding: 0 0.875rem;
			border-radius: 0.75rem;
			background: oklch(from var(--color-text) l c h / 0.06);
			color: var(--color-text);
			font-size: 0.8125rem;
			font-weight: 500;
			letter-spacing: -0.01em;
			border: none;
			cursor: pointer;
			transition: all 180ms var(--motion-ease-out);
		}

		:global(.dark) .dock-search {
			background: oklch(1 0 0 / 0.06);
		}

		/* No media query needed for base styles anymore as we want them on mobile too */

		@media (hover: hover) {
			.dock-search:hover {
				color: var(--color-text);
			}
		}

		@media (min-width: 640px) and (hover: hover) {
			.dock-search:hover {
				background: oklch(from var(--color-primary) l c h / 0.15);
			}
		}

		.dock-search:active {
			transform: scale(0.96);
		}

		.search-icon-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--color-primary);
			transition: transform 200ms var(--motion-ease-out);
			flex-shrink: 0;
			width: 1rem;
			height: 1rem;
		}

		@media (hover: hover) {
			.dock-search:hover .search-icon-wrapper {
				transform: scale(1.1) rotate(8deg);
			}
		}

		.search-label {
			display: inline;
		}

		/* No media query for label either */

		.search-kbd {
			display: none;
			padding: 0.125rem 0.375rem;
			font-family: var(--font-mono);
			font-size: 0.625rem;
			font-weight: 500;
			color: var(--color-muted);
			background: oklch(from var(--color-surface) l c h / 0.6);
			border: 1px solid oklch(from var(--color-border) l c h / 0.4);
			border-radius: 0.25rem;
		}

		@media (min-width: 640px) {
			.search-kbd {
				display: inline;
			}
		}

		/* ============================================
		 * PAGES DROPDOWN (MOBILE)
		 * ============================================ */

		.pages-backdrop {
			position: fixed;
			inset: 0;
			z-index: 40;
		}

		.pages-dropdown {
			position: absolute;
			bottom: calc(100% + 1rem);
			left: 50%;
			transform: translateX(-50%);
			z-index: 50;
			width: 180px;
			background: oklch(from var(--color-surface) calc(l * 1.05) c h / 0.95);
			backdrop-filter: blur(24px) saturate(1.8);
			border: 1px solid oklch(1 0 0 / 0.12);
			border-radius: 1.25rem;
			padding: 0.5rem;
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			box-shadow:
				0 0 0 1px oklch(0 0 0 / 0.03),
				0 8px 40px oklch(0 0 0 / 0.15);
		}

		:global(.dark) .pages-dropdown {
			background: oklch(from var(--color-surface) calc(l * 0.8) c h / 0.9);
			border-color: oklch(1 0 0 / 0.08);
		}

		.pages-item {
			display: flex;
			align-items: center;
			gap: 0.75rem;
			padding: 0.75rem 1rem;
			border-radius: 0.75rem;
			font-size: 0.875rem;
			font-weight: 500;
			color: var(--color-muted);
			text-decoration: none;
			transition: all 150ms var(--motion-ease);
		}

		.pages-item:active {
			background: oklch(from var(--color-text) l c h / 0.05);
			transform: scale(0.98);
		}

		.pages-item.active {
			color: var(--color-primary);
			background: oklch(from var(--color-primary) l c h / 0.1);
		}
	}
</style>
