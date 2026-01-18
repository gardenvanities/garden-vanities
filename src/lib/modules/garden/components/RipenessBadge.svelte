<script lang="ts">
	import type { Ripeness } from "$lib/modules/posts/types";
	import { Signal } from "@lucide/svelte";
	import Badge from "$lib/ui/Badge.svelte";

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
			color: "text-ripeness-seed"
		},
		root: {
			label: "Raiz",
			emoji: "🌿",
			color: "text-ripeness-root"
		},
		fruit: {
			label: "Fruto",
			emoji: "🍎",
			color: "text-ripeness-fruit"
		}
	} as const;

	const config = $derived(ripenessConfig[ripeness]);
</script>

{#if config}
	<Badge
		variant="secondary"
		class="group hover:border-primary/50 hover:bg-surface-elevated cursor-default rounded-[4px] px-2 py-0.5 transition-all duration-300 hover:shadow-sm {className}"
		as="span"
	>
		{#if showIcon}
			<span class="-ml-0.5 flex items-center {config.color}">
				<Signal size={12} strokeWidth={2.5} />
			</span>
		{/if}
		{#if showLabel}
			<span class="ml-1.5 pt-px text-[11px] font-medium">{config.label}</span>
		{/if}
	</Badge>
{/if}
