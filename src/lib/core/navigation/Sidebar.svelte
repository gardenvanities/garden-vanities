<script lang="ts">
	import { page } from "$app/state";
	import { commandPalette } from "$lib/core/navigation/command-palette.svelte";
	import { ui } from "$lib/stores/ui.svelte";
	import { cn } from "$lib/shared/merge-class";
	import {
		House,
		Telescope,
		Layers,
		FolderOpen,
		Library,
		Info,
		PanelLeftClose,
		PanelLeftOpen,
		Sparkles,
		X
	} from "@lucide/svelte";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import UserMenu from "./UserMenu.svelte";
	import Kbd from "$lib/ui/Kbd.svelte";

	let isExpanded = $derived(ui.sidebarExpanded);
	let isMobileOpen = $derived(ui.sidebarMobileOpen);

	const isActive = (path: string) => {
		if (path === "/") return page.url.pathname === "/";
		return page.url.pathname.startsWith(path);
	};

	const navItems = [
		{ path: "/", icon: House, label: "Início" },
		{ path: "/explore", icon: Telescope, label: "Explorar" },
		{ path: "/series", icon: Layers, label: "Séries" },
		{ path: "/sets", icon: FolderOpen, label: "Coleções" },
		{ path: "/library", icon: Library, label: "Biblioteca" },
		{ path: "/sobre", icon: Info, label: "Sobre" }
	];

	function openSearch() {
		commandPalette.open();
		ui.closeMobileSidebar();
	}

	function handleNavClick() {
		ui.closeMobileSidebar();
	}


	onMount(() => {
		const listener = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isMobileOpen) {
				ui.closeMobileSidebar();
			}
		};
		window.addEventListener("keydown", listener);
		return () => window.removeEventListener("keydown", listener);
	});
</script>

{#if isMobileOpen}
	<button
		type="button"
		class="sidebar-backdrop"
		onclick={() => ui.closeMobileSidebar()}
		aria-label="Fechar menu"
		transition:fade={{ duration: 200 }}
	></button>
{/if}

<aside
	class={cn(
		"sidebar",
		isExpanded ? "sidebar--expanded" : "sidebar--collapsed",
		isMobileOpen && "sidebar--mobile-open"
	)}
	aria-label="Navegação principal"
>
	<div class="sidebar__header">
		{#if isExpanded}
			<a href="/" class="sidebar__brand" onclick={handleNavClick}>
				<span class="sidebar__brand-text">Garden</span>
			</a>
		{/if}

		<button
			type="button"
			class="sidebar__toggle"
			onclick={() => ui.toggleSidebar()}
			aria-label={isExpanded ? "Compactar navegação" : "Expandir navegação"}
		>
			{#if isExpanded}
				<PanelLeftClose size={16} strokeWidth={2} />
			{:else}
				<PanelLeftOpen size={16} strokeWidth={2} />
			{/if}
		</button>

		<button
			type="button"
			class="sidebar__mobile-close"
			onclick={() => ui.closeMobileSidebar()}
			aria-label="Fechar menu"
		>
			<X size={16} strokeWidth={2} />
		</button>
	</div>

	<div class="sidebar__search-wrapper">
		<button type="button" class="sidebar__search" onclick={openSearch}>
			<Sparkles size={16} strokeWidth={2} />
			{#if isExpanded}
				<span class="sidebar__search-label">Buscar</span>
				<Kbd class="sidebar__search-kbd">Ctrl+K</Kbd>
			{/if}
		</button>
	</div>

	<nav class="sidebar__nav">
		{#each navItems as item (item.path)}
			<a
				href={item.path}
				class={cn("sidebar__link", isActive(item.path) && "sidebar__link--active")}
				onclick={handleNavClick}
				aria-label={item.label}
			>
				<span class="sidebar__link-icon">
					<item.icon size={18} strokeWidth={2} />
				</span>
				{#if isExpanded}
					<span class="sidebar__link-label">{item.label}</span>
				{:else}
					<span class="sidebar__tooltip">{item.label}</span>
				{/if}
			</a>
		{/each}
	</nav>

	<div class="sidebar__footer">
		<UserMenu isExpanded={isExpanded} />
	</div>
</aside>

<style>
	@layer components {
		.sidebar-backdrop {
			position: fixed;
			inset: 0;
			z-index: calc(var(--z-nav) + 1);
			background: oklch(0 0 0 / 0.45);
			backdrop-filter: blur(var(--blur-sm));
			border: none;
			cursor: default;
		}

		@media (min-width: 768px) {
			.sidebar-backdrop {
				display: none;
			}
		}

		.sidebar {
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			z-index: calc(var(--z-nav) + 2);
			display: flex;
			flex-direction: column;
			border-right: 1px solid var(--color-border);
			background: var(--color-surface);
			overflow: hidden;
			transition:
				width var(--motion-base) var(--motion-ease-entrance),
				transform var(--motion-base) var(--motion-ease-entrance);
		}

		@media (max-width: 767px) {
			.sidebar {
				width: 17rem;
				transform: translateX(-100%);
			}

			.sidebar--mobile-open {
				transform: translateX(0);
			}
		}

		@media (min-width: 768px) {
			.sidebar--collapsed {
				width: 4.5rem;
			}

			.sidebar--expanded {
				width: 14rem;
			}
		}

		.sidebar__header {
			display: flex;
			align-items: center;
			padding: var(--space-3);
			gap: var(--space-2);
			min-height: 3.25rem;
		}

		.sidebar__brand {
			text-decoration: none;
			color: var(--color-text);
			flex: 1;
			min-width: 0;
		}

		.sidebar__brand-text {
			font-family: var(--font-heading);
			font-size: var(--type-2);
			font-weight: var(--font-weight-700);
		}

		.sidebar__toggle,
		.sidebar__mobile-close {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 1.9rem;
			height: 1.9rem;
			border: 1px solid var(--color-border);
			border-radius: var(--radius-1);
			background: var(--color-bg);
			color: var(--color-muted);
			cursor: pointer;
			transition: all var(--motion-fast) var(--motion-ease-standard);
		}

		@media (hover: hover) {
			.sidebar__toggle:hover,
			.sidebar__mobile-close:hover {
				color: var(--color-text);
				background: var(--color-surface-hover);
			}
		}

		@media (min-width: 768px) {
			.sidebar__mobile-close {
				display: none;
			}
		}

		@media (max-width: 767px) {
			.sidebar__toggle {
				display: none;
			}
		}

		.sidebar__search-wrapper {
			padding: 0 var(--space-2) var(--space-3);
		}

		.sidebar__search {
			display: flex;
			align-items: center;
			gap: var(--space-2);
			width: 100%;
			height: 2.25rem;
			padding: 0 var(--space-3);
			border-radius: var(--radius-2);
			border: 1px solid var(--color-border);
			background: var(--color-bg);
			color: var(--color-muted);
			font-size: var(--type-0);
			cursor: pointer;
		}

		.sidebar__search-label {
			flex: 1;
			text-align: left;
		}

		.sidebar__search :global(.sidebar__search-kbd) {
			font-size: 0.625rem;
			opacity: 0.6;
		}

		.sidebar--collapsed .sidebar__search {
			justify-content: center;
			padding: 0;
		}

		.sidebar__nav {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			padding: 0 var(--space-2);
			overflow-y: auto;
		}

		.sidebar__link {
			position: relative;
			display: flex;
			align-items: center;
			gap: var(--space-3);
			padding: var(--space-2) var(--space-3);
			border-radius: var(--radius-2);
			color: var(--color-muted);
			text-decoration: none;
			font-size: var(--type-0);
			font-weight: var(--font-weight-500);
			transition: all var(--motion-fast) var(--motion-ease-standard);
		}

		@media (hover: hover) {
			.sidebar__link:hover {
				background: var(--color-surface-hover);
				color: var(--color-text);
			}
		}

		.sidebar__link--active {
			color: var(--color-primary);
			background: oklch(from var(--color-primary) l c h / 0.1);
		}

		.sidebar__link-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 1.25rem;
			height: 1.25rem;
			flex-shrink: 0;
		}

		.sidebar--collapsed .sidebar__link {
			justify-content: center;
			padding: var(--space-2);
		}

		.sidebar__tooltip {
			position: absolute;
			left: calc(100% + 0.65rem);
			top: 50%;
			transform: translateY(-50%);
			padding: 0.2rem 0.5rem;
			font-size: 0.6875rem;
			font-weight: var(--font-weight-600);
			color: var(--color-text);
			background: var(--color-surface-elevated);
			border: 1px solid var(--color-border);
			border-radius: var(--radius-1);
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
			z-index: 10;
			white-space: nowrap;
		}

		@media (hover: hover) {
			.sidebar__link:hover .sidebar__tooltip {
				opacity: 1;
				visibility: visible;
			}
		}

		.sidebar__footer {
			border-top: 1px solid var(--color-border);
			padding: var(--space-2);
		}

		.sidebar--collapsed .sidebar__footer {
			padding: var(--space-1);
		}
	}
</style>
