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
		class="gap-1.5 rounded-[4px] border px-2 py-0.5 font-bold tracking-widest uppercase shadow-sm backdrop-blur-sm {config.color} {className}"
		as="span"
	>
		{#if showIcon}
			<!-- Icon container for better alignment -->
			<span class="-ml-0.5 flex items-center opacity-80">
				<config.icon size={12} strokeWidth={2.5} />
			</span>
		{/if}
		{#if showLabel}
			<span class="pt-[1px] text-[10px] sm:text-[11px]">{config.label}</span>
		{/if}
	</Badge>
{/if}
