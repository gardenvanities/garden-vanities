<script lang="ts">
	import type { Ripeness } from "$lib/types";
	import { Sprout, TreeDeciduous, Apple } from "@lucide/svelte";

	interface Props {
		ripeness: Ripeness;
		showIcon?: boolean;
		showLabel?: boolean;
	}

	let { ripeness, showIcon = true, showLabel = true }: Props = $props();

	const ripenessConfig = {
		seed: {
			label: "Semente",
			emoji: "🌱",
			icon: Sprout
		},
		root: {
			label: "Raiz",
			emoji: "🌿",
			icon: TreeDeciduous
		},
		fruit: {
			label: "Fruto",
			emoji: "🍎",
			icon: Apple
		}
	} as const;

	const config = $derived(ripenessConfig[ripeness]);
</script>

{#if config}
	<span class="ripeness-badge" data-ripeness={ripeness}>
		{#if showIcon}
			<config.icon size={12} strokeWidth={2.5} />
		{/if}
		{#if showLabel}
			{config.label}
		{/if}
	</span>
{/if}

<style>
	.ripeness-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-1);
		font-size: var(--type-0);
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		transition: all var(--motion-fast) var(--motion-ease);
	}

	.ripeness-badge[data-ripeness="seed"] {
		background-color: var(--color-ripeness-seed-bg);
		color: var(--color-ripeness-seed);
		border: 1px solid oklch(from var(--color-ripeness-seed) l c h / 0.2);
	}

	.ripeness-badge[data-ripeness="root"] {
		background-color: var(--color-ripeness-root-bg);
		color: var(--color-ripeness-root);
		border: 1px solid oklch(from var(--color-ripeness-root) l c h / 0.2);
	}

	.ripeness-badge[data-ripeness="fruit"] {
		background-color: var(--color-ripeness-fruit-bg);
		color: var(--color-ripeness-fruit);
		border: 1px solid oklch(from var(--color-ripeness-fruit) l c h / 0.2);
	}
</style>
