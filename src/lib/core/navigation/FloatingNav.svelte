<script lang="ts">
	import { page } from "$app/state";
	import { commandPalette } from "$lib/core/navigation/command-palette.svelte";
	import { ui } from "$lib/stores/ui.svelte";
	import { cn } from "$lib/shared/merge-class";
	import { Home, Telescope, Library, Search, Menu } from "@lucide/svelte";
	import { onMount } from "svelte";
	import CommandPalette from "./CommandPalette.svelte";

	let isSearchOpen = $derived(commandPalette.isOpen);
	let isMobileSidebarOpen = $derived(ui.sidebarMobileOpen);

	const isActive = (path: string) => {
		if (path === "/") return page.url.pathname === "/";
		return page.url.pathname.startsWith(path);
	};


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

	$effect(() => {
		if (isSearchOpen || isMobileSidebarOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	});
</script>

<nav
	class="fixed bottom-2 left-1/2 z-nav grid w-[min(30rem,calc(100vw-1rem))] -translate-x-1/2 grid-cols-5 gap-[0.15rem] rounded-md border border-border bg-material-thick p-[0.3rem] backdrop-blur-lg md:hidden"
	aria-label="Navegação mobile"
>
	<a
		href="/"
		class={cn(
			"inline-flex h-12 flex-col items-center justify-center gap-[0.2rem] rounded-sm bg-transparent text-[0.625rem] font-semibold text-muted no-underline",
			isActive("/") && "bg-[oklch(from_var(--color-primary)_l_c_h/0.1)] text-primary"
		)}
	>
		<Home size={18} strokeWidth={2} />
		<span>Início</span>
	</a>
	<a
		href="/explore"
		class={cn(
			"inline-flex h-12 flex-col items-center justify-center gap-[0.2rem] rounded-sm bg-transparent text-[0.625rem] font-semibold text-muted no-underline",
			isActive("/explore") && "bg-[oklch(from_var(--color-primary)_l_c_h/0.1)] text-primary"
		)}
	>
		<Telescope size={18} strokeWidth={2} />
		<span>Explorar</span>
	</a>
	<button
		type="button"
		class="inline-flex h-12 flex-col items-center justify-center gap-[0.2rem] rounded-sm bg-transparent text-[0.625rem] font-semibold text-muted no-underline"
		onclick={() => commandPalette.open()}
	>
		<Search size={18} strokeWidth={2} />
		<span>Buscar</span>
	</button>
	<a
		href="/library"
		class={cn(
			"inline-flex h-12 flex-col items-center justify-center gap-[0.2rem] rounded-sm bg-transparent text-[0.625rem] font-semibold text-muted no-underline",
			isActive("/library") && "bg-[oklch(from_var(--color-primary)_l_c_h/0.1)] text-primary"
		)}
	>
		<Library size={18} strokeWidth={2} />
		<span>Biblioteca</span>
	</a>
	<button
		type="button"
		class="inline-flex h-12 flex-col items-center justify-center gap-[0.2rem] rounded-sm bg-transparent text-[0.625rem] font-semibold text-muted no-underline"
		onclick={() => ui.openMobileSidebar()}
	>
		<Menu size={18} strokeWidth={2} />
		<span>Mais</span>
	</button>
</nav>

{#if isSearchOpen}
	<button
		type="button"
		class="fixed inset-0 z-90 cursor-default border-none bg-black/60 backdrop-blur-sm"
		onclick={() => commandPalette.close()}
		onkeydown={(e) => e.key === "Escape" && commandPalette.close()}
		aria-label="Fechar busca"
		tabindex={0}
	></button>
{/if}

{#if isSearchOpen}
	<div class="fixed left-1/2 top-4 z-100 flex max-h-[calc(100dvh-2rem)] w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 flex-col sm:top-[20%] sm:max-h-[70dvh]">
		<CommandPalette />
	</div>
{/if}
