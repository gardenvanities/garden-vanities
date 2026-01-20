<script lang="ts">
	import { page } from "$app/state";
	import { commandPalette } from "$lib/core/navigation/command-palette.svelte";
	import { cn } from "$lib/shared/merge-class";
	import { ui } from "$lib/stores/ui.svelte";
	import { Sparkles, Telescope, House, Layers, FolderOpen, PanelLeft, Search, User } from "@lucide/svelte";
	import { onMount } from "svelte";
	import CommandPalette from "./CommandPalette.svelte";

	let isSearchOpen = $derived(commandPalette.isOpen);

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
		if (isSearchOpen) {
			isVisible = true;
			// Block page scroll when command palette is open
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});

	$effect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			if (currentScrollY < 10 || currentScrollY < lastScrollY) {
				isVisible = true;
			} else if (currentScrollY > lastScrollY && currentScrollY > 10) {
				isVisible = isSearchOpen;
			}
			lastScrollY = currentScrollY;
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	});

	// Hover magnification state
	let hoveredIndex = $state<number | null>(null);

	const navItems = [
		{ path: "/", icon: House, label: "Home" },
		{ path: "/explore", icon: Telescope, label: "Explorar" },
		{ path: "/series", icon: Layers, label: "Séries" },
		{ path: "/sets", icon: FolderOpen, label: "Sets" },
		{ path: "/author", icon: User, label: "Autor" }
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

	const isPostPage = $derived(
		page.url.pathname.startsWith("/posts/") && page.url.pathname !== "/posts"
	);
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

<!-- Floating Navigation Dock -->
<nav
	class={cn("floating-dock", isVisible ? "visible" : "hidden")}
	aria-label="Navegação principal"
>
	<div class="dock-container">
		<!-- Navigation Items -->
		<div class="dock-nav">
			{#each navItems as item, index (item.path)}
				{@const active = isActive(item.path)}
				{@const scale = getScale(index)}
				{#if active && item.path === "/"}
					<button
						type="button"
						class="dock-item active"
						style="--scale: {scale}"
						onmouseenter={() => handleHover(index)}
						onmouseleave={() => (hoveredIndex = null)}
						onclick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
						aria-label={item.label}
					>
						<item.icon size={20} strokeWidth={2} />
						<span class="dock-tooltip">{item.label}</span>
						<span class="dock-indicator"></span>
					</button>
				{:else}
					<a
						href={item.path}
						class={cn("dock-item", active && "active")}
						style="--scale: {scale}"
						onmouseenter={() => handleHover(index)}
						onmouseleave={() => (hoveredIndex = null)}
						aria-label={item.label}
					>
						<item.icon size={20} strokeWidth={2} />
						<span class="dock-tooltip">{item.label}</span>
						{#if active}
							<span class="dock-indicator"></span>
						{/if}
					</a>
				{/if}
			{/each}
		</div>

		<!-- Divider -->
		<div class="dock-divider"></div>

		<!-- Search Button -->
		<button
			type="button"
			class="dock-search"
			onclick={openSearch}
			aria-label="Buscar (⌘K)"
		>
			<div class="search-icon-wrapper">
				<Sparkles size={16} strokeWidth={2} />
			</div>
			<span class="search-label">Buscar</span>
			<kbd class="search-kbd">⌘K</kbd>
		</button>

		<!-- Post Page Sidebar Toggle -->
		{#if isPostPage}
			<div class="dock-divider"></div>
			<button
				type="button"
				class={cn("dock-item", ui.sidebarVisible && "active")}
				onclick={() => ui.toggleSidebar()}
				aria-label={ui.sidebarVisible ? "Ocultar sidebar" : "Mostrar sidebar"}
			>
				<PanelLeft size={20} strokeWidth={2} />
				<span class="dock-tooltip">Sidebar</span>
			</button>
		{/if}
	</div>
</nav>

<style>
	@layer components {
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

		.floating-dock.hidden {
			transform: translateX(-50%) translateY(calc(100% + 2rem));
			opacity: 0;
			pointer-events: none;
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

		.dock-search {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;
			width: 2.75rem;
			height: 2.75rem;
			padding: 0;
			border-radius: 0.875rem;
			color: var(--color-muted);
			background: transparent;
			border: none;
			cursor: pointer;
			transition: all 180ms var(--motion-ease-out);
		}

		@media (min-width: 640px) {
			.dock-search {
				width: auto;
				height: 2.5rem;
				padding: 0 0.875rem;
				border-radius: 0.75rem;
				background: oklch(from var(--color-text) l c h / 0.06);
				color: var(--color-text);
				font-size: 0.8125rem;
				font-weight: 500;
				letter-spacing: -0.01em;
			}
		}

		@media (min-width: 640px) {
			:global(.dark) .dock-search {
				background: oklch(1 0 0 / 0.06);
			}
		}

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
		}

		@media (hover: hover) {
			.dock-search:hover .search-icon-wrapper {
				transform: scale(1.1) rotate(8deg);
			}
		}

		.search-label {
			display: none;
		}

		@media (min-width: 640px) {
			.search-label {
				display: inline;
			}
		}

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
	}
</style>
