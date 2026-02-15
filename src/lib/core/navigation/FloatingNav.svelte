<script lang="ts">
	import { commandPalette } from "$lib/core/navigation/command-palette.svelte";
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



	$effect(() => {
		if (isSearchOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	});
</script>

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
	}
</style>
