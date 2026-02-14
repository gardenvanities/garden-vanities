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
		Library,
		PanelLeftClose,
		PanelLeftOpen,
		Menu,
		X
	} from "@lucide/svelte";
	import { onMount } from "svelte";
	import { fly, fade } from "svelte/transition";
	import { ui } from "$lib/stores/ui.svelte";
	import UserMenu from "./UserMenu.svelte";
	import Kbd from "$lib/ui/Kbd.svelte";

	let isExpanded = $derived(ui.sidebarExpanded);
	let isMobileOpen = $derived(ui.sidebarMobileOpen);

	const isActive = (path: string) => {
		if (path === "/") return page.url.pathname === "/";
		return page.url.pathname.startsWith(path);
	};

	const navGroups = [
		{
			title: "PRINCIPAL",
			items: [
				{ path: "/", icon: House, label: "Home" },
				{ path: "/explore", icon: Telescope, label: "Explorar" }
			]
		},
		{
			title: "ARTIGOS",
			items: [
				{ path: "/series", icon: Layers, label: "Séries" },
				{ path: "/sets", icon: FolderOpen, label: "Coleções" }
			]
		},
		{
			title: "CONTEÚDO",
			items: [{ path: "/library", icon: Library, label: "Biblioteca" }]
		}
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

<!-- Mobile hamburger trigger -->
<button
	type="button"
	class="mobile-trigger"
	onclick={() => ui.openMobileSidebar()}
	aria-label="Abrir menu"
>
	<Menu size={20} strokeWidth={2} />
</button>

<!-- Mobile backdrop -->
{#if isMobileOpen}
	<button
		type="button"
		class="sidebar-backdrop"
		onclick={() => ui.closeMobileSidebar()}
		aria-label="Fechar menu"
		transition:fade={{ duration: 200 }}
	></button>
{/if}

<!-- Sidebar -->
<aside
	class={cn(
		"sidebar",
		isExpanded ? "sidebar--expanded" : "sidebar--collapsed",
		isMobileOpen && "sidebar--mobile-open"
	)}
	aria-label="Navegação principal"
>
	<!-- Header -->
	<div class="sidebar__header">
		{#if isExpanded}
			<a href="/" class="sidebar__brand" onclick={handleNavClick}>
				<span class="sidebar__brand-text">Garden</span>
			</a>
		{/if}

		<!-- Desktop toggle -->
		<button
			type="button"
			class="sidebar__toggle desktop-only"
			onclick={() => ui.toggleSidebar()}
			aria-label={isExpanded ? "Colapsar sidebar" : "Expandir sidebar"}
		>
			{#if isExpanded}
				<PanelLeftClose size={18} strokeWidth={2} />
			{:else}
				<PanelLeftOpen size={18} strokeWidth={2} />
			{/if}
		</button>

		<!-- Mobile close -->
		<button
			type="button"
			class="sidebar__toggle mobile-only"
			onclick={() => ui.closeMobileSidebar()}
			aria-label="Fechar menu"
		>
			<X size={18} strokeWidth={2} />
		</button>
	</div>

	<!-- Search -->
	<div class="sidebar__search-wrapper">
		<button type="button" class="sidebar__search" onclick={openSearch}>
			<Sparkles size={16} strokeWidth={2} />
			{#if isExpanded}
				<span class="sidebar__search-label">Buscar</span>
				<Kbd class="sidebar__search-kbd">Ctrl+K</Kbd>
			{/if}
		</button>
	</div>

	<!-- Navigation -->
	<nav class="sidebar__nav">
		{#each navGroups as group (group.title)}
			<div class="sidebar__group">
				{#if isExpanded}
					<span class="sidebar__group-title">{group.title}</span>
				{:else}
					<div class="sidebar__group-divider"></div>
				{/if}
				{#each group.items as item (item.path)}
					<a
						href={item.path}
						class={cn("sidebar__link", isActive(item.path) && "sidebar__link--active")}
						onclick={handleNavClick}
						aria-label={item.label}
					>
						<span class="sidebar__link-icon">
							<item.icon size={20} strokeWidth={2} />
						</span>
						{#if isExpanded}
							<span class="sidebar__link-label">{item.label}</span>
						{/if}
						{#if !isExpanded}
							<span class="sidebar__tooltip">{item.label}</span>
						{/if}
					</a>
				{/each}
			</div>
		{/each}
	</nav>

	<!-- Footer -->
	<div class="sidebar__footer">
		<div class="sidebar__user">
			<UserMenu {isExpanded} />
		</div>
	</div>
</aside>

<style>
	@layer components {
		/* ===== Mobile Trigger ===== */
		.mobile-trigger {
			position: fixed;
			top: var(--space-4);
			left: var(--space-4);
			z-index: var(--z-nav);
			display: flex;
			align-items: center;
			justify-content: center;
			width: 2.5rem;
			height: 2.5rem;
			border-radius: var(--radius-2);
			border: 1px solid var(--color-border);
			background: var(--material-thick);
			backdrop-filter: blur(var(--blur-lg));
			-webkit-backdrop-filter: blur(var(--blur-lg));
			color: var(--color-text);
			cursor: pointer;
			transition: all var(--motion-fast) var(--motion-ease);
			box-shadow: var(--shadow-2);
		}

		.mobile-trigger:active {
			transform: scale(0.92);
		}

		@media (min-width: 768px) {
			.mobile-trigger {
				display: none;
			}
		}

		/* ===== Backdrop ===== */
		.sidebar-backdrop {
			position: fixed;
			inset: 0;
			z-index: calc(var(--z-nav) + 1);
			background: oklch(0 0 0 / 0.5);
			backdrop-filter: blur(var(--blur-sm));
			border: none;
			cursor: default;
		}

		@media (min-width: 768px) {
			.sidebar-backdrop {
				display: none;
			}
		}

		/* ===== Sidebar ===== */
		.sidebar {
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			z-index: calc(var(--z-nav) + 2);
			display: flex;
			flex-direction: column;
			background-color: var(--color-surface);
			border-right: 1px solid var(--color-border);
			overflow-y: auto;
			overflow-x: hidden;
			scrollbar-width: none;
			transition:
				width var(--motion-base) var(--motion-ease-out-quint),
				transform var(--motion-base) var(--motion-ease-out-quint);
		}

		.sidebar::-webkit-scrollbar {
			display: none;
		}

		/* Mobile: hidden by default, slides in */
		@media (max-width: 767px) {
			.sidebar {
				width: 280px;
				transform: translateX(-100%);
			}

			.sidebar--mobile-open {
				transform: translateX(0);
			}
		}

		/* Tablet: collapsed icons */
		@media (min-width: 768px) and (max-width: 1023px) {
			.sidebar {
				width: 64px;
			}

			.sidebar--expanded {
				width: 260px;
			}
		}

		/* Desktop */
		@media (min-width: 1024px) {
			.sidebar--expanded {
				width: 260px;
			}

			.sidebar--collapsed {
				width: 64px;
			}
		}

		/* ===== Header ===== */
		.sidebar__header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: var(--space-4);
			min-height: 3.5rem;
			gap: var(--space-2);
		}

		.sidebar__brand {
			text-decoration: none;
			color: var(--color-text);
			display: flex;
			align-items: center;
			gap: var(--space-2);
			flex: 1;
			min-width: 0;
		}

		.sidebar__brand-text {
			font-family: var(--font-heading);
			font-size: var(--type-2);
			font-weight: var(--font-weight-700);
			letter-spacing: var(--letter-spacing-tight);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.sidebar__toggle {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 2rem;
			height: 2rem;
			border-radius: var(--radius-1);
			border: none;
			background: transparent;
			color: var(--color-muted);
			cursor: pointer;
			flex-shrink: 0;
			transition: all var(--motion-fast) var(--motion-ease);
		}

		@media (hover: hover) {
			.sidebar__toggle:hover {
				color: var(--color-text);
				background: var(--color-surface-hover);
			}
		}

		.sidebar__toggle:active {
			transform: scale(0.9);
		}

		.desktop-only {
			display: none;
		}

		.mobile-only {
			display: flex;
		}

		@media (min-width: 768px) {
			.desktop-only {
				display: flex;
			}

			.mobile-only {
				display: none;
			}
		}

		/* ===== Search ===== */
		.sidebar__search-wrapper {
			padding: 0 var(--space-3);
			margin-bottom: var(--space-3);
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
			font-weight: var(--font-weight-500);
			cursor: pointer;
			transition: all var(--motion-fast) var(--motion-ease);
		}

		@media (hover: hover) {
			.sidebar__search:hover {
				border-color: var(--color-border-vivid);
				color: var(--color-text);
			}
		}

		.sidebar__search:active {
			transform: scale(0.98);
		}

		.sidebar__search-label {
			flex: 1;
			text-align: left;
			white-space: nowrap;
		}

		.sidebar__search :global(.sidebar__search-kbd) {
			font-size: 0.625rem;
			opacity: 0.6;
		}

		/* Collapsed: search becomes icon-only */
		.sidebar--collapsed .sidebar__search {
			justify-content: center;
			padding: 0;
			border: none;
			background: transparent;
		}

		@media (min-width: 768px) and (max-width: 1023px) {
			.sidebar:not(.sidebar--expanded) .sidebar__search {
				justify-content: center;
				padding: 0;
				border: none;
				background: transparent;
			}
		}

		/* ===== Nav ===== */
		.sidebar__nav {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: var(--space-2);
			padding: 0 var(--space-3);
			overflow-y: auto;
			scrollbar-width: none;
		}

		.sidebar__nav::-webkit-scrollbar {
			display: none;
		}

		.sidebar__group {
			display: flex;
			flex-direction: column;
			gap: var(--space-1);
		}

		.sidebar__group-title {
			font-size: 0.625rem;
			font-weight: var(--font-weight-600);
			text-transform: uppercase;
			letter-spacing: var(--letter-spacing-caps);
			color: var(--color-muted);
			padding: var(--space-2) var(--space-3) var(--space-1);
			opacity: 0.7;
			white-space: nowrap;
		}

		.sidebar__group-divider {
			height: 1px;
			background: var(--color-border);
			margin: var(--space-2) var(--space-3);
			opacity: 0.5;
		}

		/* ===== Nav Link ===== */
		.sidebar__link {
			position: relative;
			display: flex;
			align-items: center;
			gap: var(--space-3);
			padding: var(--space-2) var(--space-3);
			border-radius: var(--radius-2);
			text-decoration: none;
			color: var(--color-muted);
			font-size: var(--type-0);
			font-weight: var(--font-weight-500);
			white-space: nowrap;
			transition: all var(--motion-fast) var(--motion-ease);
		}

		@media (hover: hover) {
			.sidebar__link:hover {
				color: var(--color-text);
				background: var(--color-surface-hover);
			}
		}

		.sidebar__link:active {
			transform: scale(0.97);
		}

		.sidebar__link--active {
			color: var(--color-primary);
			background: oklch(from var(--color-primary) l c h / 0.08);
		}

		@media (hover: hover) {
			.sidebar__link--active:hover {
				background: oklch(from var(--color-primary) l c h / 0.12);
			}
		}

		.sidebar__link-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 1.25rem;
			height: 1.25rem;
			flex-shrink: 0;
		}

		.sidebar__link-label {
			overflow: hidden;
			text-overflow: ellipsis;
		}

		/* Collapsed: center icons */
		.sidebar--collapsed .sidebar__link {
			justify-content: center;
			padding: var(--space-2);
		}

		@media (min-width: 768px) and (max-width: 1023px) {
			.sidebar:not(.sidebar--expanded) .sidebar__link {
				justify-content: center;
				padding: var(--space-2);
			}
		}

		/* ===== Tooltip ===== */
		.sidebar__tooltip {
			position: absolute;
			left: calc(100% + 0.75rem);
			top: 50%;
			transform: translateY(-50%) translateX(-4px);
			padding: var(--space-1) var(--space-3);
			font-size: 0.6875rem;
			font-weight: var(--font-weight-600);
			white-space: nowrap;
			color: var(--color-text);
			background: var(--color-surface-elevated);
			border: 1px solid var(--color-border);
			border-radius: var(--radius-2);
			box-shadow: var(--shadow-2);
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
			z-index: 10;
			transition:
				opacity var(--motion-fast) var(--motion-ease),
				transform var(--motion-fast) var(--motion-ease),
				visibility var(--motion-fast) var(--motion-ease);
		}

		@media (hover: hover) {
			.sidebar__link:hover .sidebar__tooltip {
				opacity: 1;
				visibility: visible;
				transform: translateY(-50%) translateX(0);
			}
		}

		/* ===== Footer ===== */
		.sidebar__footer {
			padding: var(--space-3);
			border-top: 1px solid var(--color-border);
			margin-top: auto;
		}

		.sidebar__user {
			display: flex;
			justify-content: center;
			width: 100%;
		}

		/* Collapsed footer: smaller padding */
		.sidebar--collapsed .sidebar__footer {
			padding: var(--space-2);
		}

		@media (min-width: 768px) and (max-width: 1023px) {
			.sidebar:not(.sidebar--expanded) .sidebar__footer {
				padding: var(--space-2);
			}
		}
	}
</style>
