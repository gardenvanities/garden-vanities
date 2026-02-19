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
		Rose,
		PanelLeftClose,
		PanelLeftOpen,
		Search,
		X
	} from "@lucide/svelte";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import UserMenu from "./UserMenu.svelte";
	import Kbd from "$lib/ui/Kbd.svelte";

	let isExpanded = $derived(ui.sidebarExpanded);
	let isMobileOpen = $derived(ui.sidebarMobileOpen);
	let showExpandAffordance = $state(false);

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

	function isCollapsedDesktop() {
		return !isExpanded && window.matchMedia("(min-width: 768px)").matches;
	}

	function handleCollapsedHover(hovered: boolean) {
		showExpandAffordance = isCollapsedDesktop() ? hovered : false;
	}

	function openCollapsedSidebar(event?: MouseEvent) {
		if (!isCollapsedDesktop()) return;
		event?.preventDefault();
		event?.stopPropagation();
		ui.openSidebar();
	}

	function openSearch(event?: MouseEvent) {
		if (isCollapsedDesktop()) {
			openCollapsedSidebar(event);
			return;
		}
		commandPalette.open();
		ui.closeMobileSidebar();
	}

	function handleNavClick(event?: MouseEvent) {
		if (isCollapsedDesktop()) {
			openCollapsedSidebar(event);
			return;
		}
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
		class="fixed inset-0 z-[calc(var(--z-nav)+1)] border-none bg-background/60 md:hidden"
		onclick={() => ui.closeMobileSidebar()}
		aria-label="Fechar menu"
		transition:fade={{ duration: 200 }}
	></button>
{/if}

<aside
	class={cn(
		"fixed inset-y-0 left-0 z-[calc(var(--z-nav)+2)] flex w-[18rem] -translate-x-full flex-col overflow-visible border-r border-border bg-surface transition-[width,transform] duration-base ease-entrance md:translate-x-0",
		isExpanded ? "md:w-70" : "md:w-19",
		isMobileOpen && "translate-x-0"
	)}
	onmouseenter={() => handleCollapsedHover(true)}
	onmouseleave={() => handleCollapsedHover(false)}
	aria-label="Navegação principal"
>
	<div class="flex h-13 items-center gap-2 border-b border-border px-3">
		<a href="/" class="flex min-w-0 flex-1 items-center gap-3 overflow-hidden text-text no-underline" onclick={handleNavClick} aria-label="Início">
			<span class="inline-flex h-[1.2rem] w-[1.2rem] shrink-0 items-center justify-center">
				{#if showExpandAffordance}
					<PanelLeftOpen size={16} strokeWidth={2} />
				{:else}
					<Rose size={16} strokeWidth={2} />
				{/if}
			</span>
			<span
				class={cn(
					"font-heading max-w-44 whitespace-nowrap text-lg font-semibold opacity-100 transition-[opacity,max-width] duration-fast ease-standard",
					!isExpanded && "md:max-w-0 md:opacity-0"
				)}
			>
				Garden
			</span>
		</a>

		<button
			type="button"
			class={cn(
				"hidden h-8 w-8 items-center justify-center rounded-sm border border-border bg-surface-elevated text-muted transition-base hover:bg-surface-hover hover:text-text md:inline-flex",
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
			class="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-surface-elevated text-muted transition-base hover:bg-surface-hover hover:text-text md:hidden"
			onclick={() => ui.closeMobileSidebar()}
			aria-label="Fechar menu"
		>
			<X size={16} strokeWidth={2} />
		</button>
	</div>

	<div>
		<button
			type="button"
			class={cn(
				"flex h-12 w-full items-center gap-3 border-x-0 border-t-0 border-b border-border bg-surface-elevated px-5 text-muted transition-fast hover:bg-surface-hover hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
			)}
			onclick={openSearch}
			aria-label="Abrir busca"
		>
			<span class="inline-flex h-[1.2rem] w-[1.2rem] shrink-0 items-center justify-center">
				<Search size={16} strokeWidth={2} />
			</span>
			<span
				class={cn(
					"min-w-0 flex-1 overflow-hidden whitespace-nowrap text-left text-sm opacity-100 transition-[opacity,max-width] duration-fast ease-standard",
					!isExpanded && "md:max-w-0 md:opacity-0"
				)}
			>
				Buscar
			</span>
			<Kbd
				class={cn(
					"max-w-[4.6rem] overflow-hidden whitespace-nowrap text-[10px] opacity-70 transition-[opacity,max-width] duration-fast ease-standard",
					!isExpanded && "md:max-w-0 md:opacity-0"
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
					"group relative flex min-w-0 items-center gap-3 rounded-md border border-transparent px-3 py-[0.55rem] text-sm font-medium text-muted no-underline transition-base hover:bg-surface-hover hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
					isActive(item.path) &&
						"border border-[color-mix(in_oklab,var(--color-border-vivid)_66%,var(--color-border))] bg-[color-mix(in_oklab,var(--color-surface-elevated)_94%,var(--color-primary))] text-text"
				)}
				onclick={handleNavClick}
				aria-label={item.label}
			>
				<span class="inline-flex h-[1.2rem] w-[1.2rem] shrink-0 items-center justify-center">
					<item.icon size={17} strokeWidth={2} />
				</span>
				<span
					class={cn(
						"max-w-48 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap opacity-100 transition-[opacity,max-width] duration-fast ease-standard",
						!isExpanded && "md:max-w-0 md:opacity-0"
					)}
				>
					{item.label}
				</span>
				<span
					class={cn(
						"pointer-events-none invisible absolute top-1/2 left-[calc(100%+0.65rem)] z-10 -translate-y-1/2 whitespace-nowrap rounded-sm border border-border bg-surface-elevated px-2 py-[0.2rem] text-[11px] font-semibold text-text opacity-0",
						!isExpanded && "md:group-hover:visible md:group-hover:opacity-100"
					)}
				>
					{item.label}
				</span>
			</a>
		{/each}
	</nav>

	<div class={cn("border-t border-border px-2 pb-2", !isExpanded && "md:px-1 md:pb-1")}>
		<UserMenu {isExpanded} />
	</div>

	{#if !isExpanded}
		<button
			type="button"
			class="absolute inset-x-0 top-13 bottom-0 z-10 hidden bg-transparent border-none md:block"
			onclick={openCollapsedSidebar}
			aria-label="Expandir navegação"
		></button>
	{/if}
</aside>
