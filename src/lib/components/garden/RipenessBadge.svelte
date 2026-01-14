<script lang="ts">
	import type { Ripeness } from "$lib/types";
	import { Sprout, TreeDeciduous, Apple } from "@lucide/svelte";
	import Badge from "$lib/components/ui/Badge.svelte";

	interface Props {
		ripeness: Ripeness;
		showIcon?: boolean;
		showLabel?: boolean;
		class?: string;
	}

	let { ripeness, showIcon = true, showLabel = true, class: className = "" }: Props = $props();

	const ripenessConfig = {
		seed: {
			label: "Semente",
			emoji: "🌱",
			icon: Sprout,
			color: "text-ripeness-seed bg-ripeness-seed-bg border-ripeness-seed/20"
		},
		root: {
			label: "Raiz",
			emoji: "🌿",
			icon: TreeDeciduous,
			color: "text-ripeness-root bg-ripeness-root-bg border-ripeness-root/20"
		},
		fruit: {
			label: "Fruto",
			emoji: "🍎",
			icon: Apple,
			color: "text-ripeness-fruit bg-ripeness-fruit-bg border-ripeness-fruit/20"
		}
	} as const;

	const config = $derived(ripenessConfig[ripeness]);
</script>

{#if config}
	<Badge
		variant="outline"
		class="gap-1 border font-bold tracking-widest uppercase {config.color} {className}"
		as="span"
	>
		{#if showIcon}
			<config.icon size={12} strokeWidth={2.5} />
		{/if}
		{#if showLabel}
			{config.label}
		{/if}
	</Badge>
{/if}
