<script lang="ts">
	import { page } from "$app/state";
	import { commandPalette } from "$lib/core/navigation/command-palette.svelte";
	import { ui } from "$lib/stores/ui.svelte";
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

<nav class="bottom-nav" aria-label="Navegação mobile">
	<a
		href="/"
		class="bottom-nav__item"
		class:bottom-nav__item--active={isActive("/")}
	>
		<Home size={18} strokeWidth={2} />
		<span>Início</span>
	</a>
	<a
		href="/explore"
		class="bottom-nav__item"
		class:bottom-nav__item--active={isActive("/explore")}
	>
		<Telescope size={18} strokeWidth={2} />
		<span>Explorar</span>
	</a>
	<button type="button" class="bottom-nav__item" onclick={() => commandPalette.open()}>
		<Search size={18} strokeWidth={2} />
		<span>Buscar</span>
	</button>
	<a
		href="/library"
		class="bottom-nav__item"
		class:bottom-nav__item--active={isActive("/library")}
	>
		<Library size={18} strokeWidth={2} />
		<span>Biblioteca</span>
	</a>
	<button type="button" class="bottom-nav__item" onclick={() => ui.openMobileSidebar()}>
		<Menu size={18} strokeWidth={2} />
		<span>Mais</span>
	</button>
</nav>

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

{#if isSearchOpen}
	<div class="command-modal">
		<CommandPalette />
	</div>
{/if}

<style>
	@layer components {
		.bottom-nav {
			position: fixed;
			left: 50%;
			bottom: 0.5rem;
			transform: translateX(-50%);
			display: grid;
			grid-template-columns: repeat(5, minmax(0, 1fr));
			gap: 0.15rem;
			width: min(30rem, calc(100vw - 1rem));
			padding: 0.3rem;
			border: 1px solid var(--color-border);
			border-radius: var(--radius-2);
			background: var(--material-thick);
			backdrop-filter: blur(var(--blur-lg));
			-webkit-backdrop-filter: blur(var(--blur-lg));
			z-index: var(--z-nav);
		}

		@media (min-width: 768px) {
			.bottom-nav {
				display: none;
			}
		}

		.bottom-nav__item {
			display: inline-flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 0.2rem;
			height: 3rem;
			border: none;
			border-radius: var(--radius-1);
			background: transparent;
			color: var(--color-muted);
			font-size: 0.625rem;
			font-weight: var(--font-weight-600);
			text-decoration: none;
		}

		.bottom-nav__item--active {
			color: var(--color-primary);
			background: oklch(from var(--color-primary) l c h / 0.1);
		}

		.command-backdrop {
			position: fixed;
			inset: 0;
			z-index: 90;
			background: oklch(0 0 0 / 0.6);
			backdrop-filter: blur(8px);
			border: none;
			cursor: default;
			animation: fade-in 200ms var(--motion-ease-entrance) forwards;
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
			animation: modal-in 250ms var(--motion-ease-entrance) forwards;
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
	}
</style>
