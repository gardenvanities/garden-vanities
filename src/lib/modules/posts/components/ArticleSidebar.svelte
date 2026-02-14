<script lang="ts">
	import { commandPalette } from "$lib/core/navigation/command-palette.svelte";
	import { cn } from "$lib/shared/merge-class";
	import {
		PanelRightClose,
		PanelRightOpen,
		X,
		List,
	} from "@lucide/svelte";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { ui } from "$lib/stores/ui.svelte";
	import TableOfContents from "$lib/modules/garden/components/TableOfContents.svelte";
	import ReadingProgress from "./ReadingProgress.svelte";
	import type { PostFrontmatter } from "$lib/modules/posts/types";

	let { metadata }: { metadata: PostFrontmatter } = $props();

	let isExpanded = $derived(ui.articleSidebarExpanded);
	let isMobileOpen = $derived(ui.articleSidebarMobileOpen);

	function openSearch() {
		commandPalette.open();
		ui.closeArticleSidebarMobile();
	}

	onMount(() => {
		const listener = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isMobileOpen) {
				ui.closeArticleSidebarMobile();
			}
		};
		window.addEventListener("keydown", listener);
		return () => window.removeEventListener("keydown", listener);
	});
</script>

<!-- Mobile trigger is usually outside, but we can have a floating one if needed. 
     For now, we'll assume the layout handles the trigger or we explicitly look for where to put it. 
	 However, standardizing: the Article Layout likely needs a trigger. 
	 Since this is "ArticleSidebar", let's keep it self-contained if possible, 
	 but usually the trigger is in the sticky header on mobile. 
	 We will add a floating trigger for mobile here just in case, similar to the main sidebar. -->
<button
	type="button"
	class="mobile-trigger"
	onclick={() => ui.openArticleSidebarMobile()}
	aria-label="Abrir menu do artigo"
>
	<List size={20} strokeWidth={2} />
</button>

<!-- Mobile backdrop -->
{#if isMobileOpen}
	<button
		type="button"
		class="sidebar-backdrop"
		onclick={() => ui.closeArticleSidebarMobile()}
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
	aria-label="Navegação do artigo"
>
	<!-- Header -->
	<div class="sidebar__header">
		
		<!-- Desktop toggle -->
		<button
			type="button"
			class="sidebar__toggle desktop-only"
			onclick={() => ui.toggleArticleSidebar()}
			aria-label={isExpanded ? "Colapsar menu" : "Expandir menu"}
		>
			{#if isExpanded}
				<PanelRightClose size={18} strokeWidth={2} />
			{:else}
				<PanelRightOpen size={18} strokeWidth={2} />
			{/if}
		</button>
		
		{#if isExpanded}
			<span class="sidebar__title">Neste Artigo</span>
		{/if}

		<!-- Mobile close -->
		<button
			type="button"
			class="sidebar__toggle mobile-only ml-auto"
			onclick={() => ui.closeArticleSidebarMobile()}
			aria-label="Fechar menu"
		>
			<X size={18} strokeWidth={2} />
		</button>
	</div>

	<!-- Navigation (TOC) -->
	<div class="sidebar__content" data-lenis-prevent>
		{#if isExpanded || isMobileOpen}
			<div class="toc-wrapper">
				<TableOfContents key={metadata.slug} title="" />
			</div>
		{/if}
	</div>

	<!-- Footer (Reading Progress) -->
	{#if isExpanded || isMobileOpen}
		<div class="sidebar__footer">
			<ReadingProgress />
		</div>
	{/if}
</aside>

<style>
	@layer components {
		/* ===== Mobile Trigger ===== */
		.mobile-trigger {
			position: fixed;
			top: var(--space-4);
			right: var(--space-4);
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

		@media (min-width: 1024px) {
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

		@media (min-width: 1024px) {
			.sidebar-backdrop {
				display: none;
			}
		}

		/* ===== Sidebar ===== */
		.sidebar {
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: calc(var(--z-nav) + 2);
			display: flex;
			flex-direction: column;
			background-color: var(--color-surface);
			border-left: 1px solid var(--color-border);
			transition:
				width var(--motion-base) var(--motion-ease-out-quint),
				transform var(--motion-base) var(--motion-ease-out-quint);
		}

		/* Mobile: hidden by default, slides in right content */
		@media (max-width: 1023px) {
			.sidebar {
				width: 280px;
				transform: translateX(100%);
				border-left: 1px solid var(--color-border);
			}

			.sidebar--mobile-open {
				transform: translateX(0);
			}
		}

		/* Desktop */
		@media (min-width: 1024px) {
			.sidebar--expanded {
				width: 260px;
			}

			.sidebar--collapsed {
				width: 48px;
			}
		}

		/* ===== Header ===== */
		.sidebar__header {
			display: flex;
			align-items: center;
			padding: var(--space-4);
			min-height: 3.5rem;
			gap: var(--space-2);
		}

		.sidebar__title {
			font-size: 0.75rem;
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: var(--letter-spacing-widest);
			color: var(--color-muted);
			white-space: nowrap;
			overflow: hidden;
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

		@media (min-width: 1024px) {
			.desktop-only {
				display: flex;
			}

			.mobile-only {
				display: none;
			}
		}

		/* ===== Content ===== */
		.sidebar__content {
			flex: 1;
			overflow-y: auto;
			overflow-x: hidden;
			padding: 0 var(--space-3);
			scrollbar-width: none;
		}
		
		.sidebar__content::-webkit-scrollbar {
			display: none;
		}

		/* ===== Footer ===== */
		.sidebar__footer {
			margin-top: auto;
		}
	}
</style>
