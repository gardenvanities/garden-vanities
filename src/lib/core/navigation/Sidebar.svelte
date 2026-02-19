<script lang="ts">
	import { page } from "$app/state";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import {
		FolderOpen,
		House,
		Info,
		Layers,
		Library,
		PanelLeftClose,
		PanelLeftOpen,
		Rose,
		Search,
		Telescope,
		X
	} from "@lucide/svelte";
	import { commandPalette } from "$lib/core/navigation/command-palette.svelte";
	import { cn } from "$lib/shared/merge-class";
	import { ui } from "$lib/stores/ui.svelte";
	import Kbd from "$lib/ui/Kbd.svelte";
	import UserMenu from "./UserMenu.svelte";

	const INTERACTIVE_SELECTOR = "a,button,[role='button']";
	const ICON_SLOT_CLASS = "inline-flex h-8 w-8 shrink-0 items-center justify-center";

	let isExpanded = $derived(ui.sidebarExpanded);
	let isMobileOpen = $derived(ui.sidebarMobileOpen);
	let showExpandAffordance = $state(false);
	let sidebarRef = $state<HTMLElement | null>(null);
	let brandLinkRef = $state<HTMLAnchorElement | null>(null);

	const navItems = [
		{ path: "/", icon: House, label: "Início" },
		{ path: "/explore", icon: Telescope, label: "Explorar" },
		{ path: "/series", icon: Layers, label: "Séries" },
		{ path: "/sets", icon: FolderOpen, label: "Coleções" },
		{ path: "/library", icon: Library, label: "Biblioteca" },
		{ path: "/sobre", icon: Info, label: "Sobre" }
	] as const;

	const isActive = (path: string) => {
		if (path === "/") return page.url.pathname === "/";
		return page.url.pathname.startsWith(path);
	};

	function isCollapsedDesktop() {
		return (
			typeof window !== "undefined" &&
			!isExpanded &&
			window.matchMedia("(min-width: 768px)").matches
		);
	}

	function getInteractiveAncestor(target: EventTarget | null) {
		if (!(target instanceof HTMLElement)) return null;
		return target.closest<HTMLElement>(INTERACTIVE_SELECTOR);
	}

	function handleSidebarMouseMove(event: MouseEvent) {
		if (!isCollapsedDesktop()) {
			showExpandAffordance = false;
			return;
		}

		const interactiveAncestor = getInteractiveAncestor(event.target);
		showExpandAffordance =
			!interactiveAncestor || interactiveAncestor === brandLinkRef;
	}

	function openCollapsedSidebar(event?: MouseEvent) {
		if (!isCollapsedDesktop()) return false;
		event?.preventDefault();
		event?.stopPropagation();
		ui.openSidebar();
		return true;
	}

	function handleBrandClick(event?: MouseEvent) {
		if (openCollapsedSidebar(event)) return;
		ui.closeMobileSidebar();
	}

	function handleNavClick() {
		ui.closeMobileSidebar();
	}

	function handleSearchClick() {
		commandPalette.open();
		ui.closeMobileSidebar();
	}

	onMount(() => {
		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isMobileOpen) {
				ui.closeMobileSidebar();
			}
		};

		const handleWindowClick = (event: MouseEvent) => {
			if (!isCollapsedDesktop() || !sidebarRef) return;
			if (!(event.target instanceof HTMLElement)) return;
			if (!sidebarRef.contains(event.target)) return;
			if (getInteractiveAncestor(event.target)) return;
			openCollapsedSidebar();
		};

		window.addEventListener("keydown", handleKeydown);
		window.addEventListener("click", handleWindowClick);

		return () => {
			window.removeEventListener("keydown", handleKeydown);
			window.removeEventListener("click", handleWindowClick);
		};
	});
</script>

{#if isMobileOpen}
	<button
		type="button"
		class="bg-background/60 fixed inset-0 z-[calc(var(--z-nav)+1)] border-none md:hidden"
		onclick={() => ui.closeMobileSidebar()}
		aria-label="Fechar menu"
		transition:fade={{ duration: 200 }}
	></button>
{/if}

<aside
	bind:this={sidebarRef}
	class={cn(
		"border-border bg-surface duration-base ease-entrance fixed inset-y-0 left-0 z-[calc(var(--z-nav)+2)] flex w-[18rem] -translate-x-full flex-col overflow-visible border-r transition-transform md:translate-x-0",
		isExpanded ? "md:w-70" : "md:w-12",
		showExpandAffordance && !isExpanded && "md:cursor-e-resize",
		isMobileOpen && "translate-x-0"
	)}
	onmousemove={handleSidebarMouseMove}
	onmouseleave={() => (showExpandAffordance = false)}
	aria-label="Navegação principal"
>
	<div class="border-border flex h-13 items-center gap-2 border-b px-2">
		<a
			bind:this={brandLinkRef}
			href="/"
			class={cn(
				"text-text hover:bg-surface-hover focus-visible:outline-focus flex h-11 min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-md px-2 no-underline transition-base focus-visible:outline-2 focus-visible:outline-offset-2",
				!isExpanded && "md:cursor-e-resize"
			)}
			onclick={handleBrandClick}
			aria-label="Início"
		>
			<span class={ICON_SLOT_CLASS}>
				{#if showExpandAffordance && !isExpanded}
					<PanelLeftOpen size={16} strokeWidth={2} />
				{:else}
					<Rose size={16} strokeWidth={2} />
				{/if}
			</span>
			<span
				class={cn(
					"font-heading max-w-44 min-w-0 overflow-hidden text-lg font-semibold text-ellipsis whitespace-nowrap",
					!isExpanded && "md:max-w-0 md:transition-none"
				)}
			>
				Garden
			</span>
		</a>

		<button
			type="button"
			class={cn(
				"border-border bg-surface-elevated text-muted transition-base hover:bg-surface-hover hover:text-text hidden h-11 w-11 items-center justify-center rounded-sm border md:inline-flex",
				isExpanded && "md:cursor-w-resize",
				!isExpanded && "md:hidden"
			)}
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
			class="border-border bg-surface-elevated text-muted transition-base hover:bg-surface-hover hover:text-text inline-flex h-11 w-11 items-center justify-center rounded-sm border md:hidden"
			onclick={() => ui.closeMobileSidebar()}
			aria-label="Fechar menu"
		>
			<X size={16} strokeWidth={2} />
		</button>
	</div>

	<div class="border-border border-b px-2 py-1.5">
		<button
			type="button"
			class={cn(
				"bg-surface-elevated text-muted transition-fast hover:bg-surface-hover hover:text-text focus-visible:outline-focus flex h-11 w-full items-center gap-3 overflow-hidden rounded-md border border-transparent px-2 focus-visible:outline-2 focus-visible:outline-offset-2"
			)}
			onclick={handleSearchClick}
			aria-label="Abrir busca"
		>
			<span class={ICON_SLOT_CLASS}>
				<Search size={16} strokeWidth={2} />
			</span>
			<span
				class={cn(
					"max-w-44 min-w-0 flex-1 overflow-hidden text-left text-sm text-ellipsis whitespace-nowrap",
					!isExpanded && "md:max-w-0 md:transition-none"
				)}
			>
				Buscar
			</span>
			<Kbd
				class={cn(
					"max-w-[4.6rem] shrink-0 overflow-hidden text-[10px] whitespace-nowrap opacity-70",
					!isExpanded && "md:max-w-0 md:transition-none"
				)}
			>
				Ctrl+K
			</Kbd>
		</button>
	</div>

	<nav class="mt-2 flex flex-1 flex-col gap-[0.2rem] overflow-x-hidden overflow-y-auto px-2 pb-2">
		{#each navItems as item (item.path)}
			<a
				href={item.path}
				class={cn(
					"group text-muted transition-base hover:bg-surface-hover hover:text-text focus-visible:outline-focus relative flex h-11 min-w-0 items-center gap-3 overflow-hidden rounded-md border border-transparent px-2 text-sm font-medium no-underline focus-visible:outline-2 focus-visible:outline-offset-2",
					isActive(item.path) &&
						"text-text border border-[color-mix(in_oklab,var(--color-border-vivid)_66%,var(--color-border))] bg-[color-mix(in_oklab,var(--color-surface-elevated)_94%,var(--color-primary))]"
				)}
				onclick={handleNavClick}
				aria-label={item.label}
				aria-current={isActive(item.path) ? "page" : undefined}
			>
				<span class={ICON_SLOT_CLASS}>
					<item.icon size={16} strokeWidth={2} />
				</span>
				<span
					class={cn(
						"max-w-48 min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap",
						!isExpanded && "md:max-w-0 md:transition-none"
					)}
				>
					{item.label}
				</span>
				<span
					class={cn(
						"border-border bg-surface-elevated text-text pointer-events-none invisible absolute top-1/2 left-[calc(100%+0.65rem)] z-10 -translate-y-1/2 rounded-sm border px-2 py-[0.2rem] text-[11px] font-semibold whitespace-nowrap opacity-0",
						!isExpanded && "md:group-hover:visible md:group-hover:opacity-100"
					)}
				>
					{item.label}
				</span>
			</a>
		{/each}
	</nav>

	<div class="border-border border-t px-2 py-2">
		<UserMenu {isExpanded} />
	</div>
</aside>
