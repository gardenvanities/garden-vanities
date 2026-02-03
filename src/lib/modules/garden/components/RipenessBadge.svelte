<script lang="ts">
	import type { Ripeness } from "$lib/modules/posts/types";
	import { Sprout } from "@lucide/svelte";


	interface Props {
		ripeness: Ripeness;
		showIcon?: boolean;
		showLabel?: boolean;
		active?: boolean;
		class?: string;
	}

	let {
		ripeness,
		showIcon = true,
		showLabel = true,
		active = false,
		class: className = ""
	}: Props = $props();

	import SmartBadge from "$lib/ui/SmartBadge.svelte";

	const ripenessConfig = {
		seed: {
			label: "Semente",
			base: "border-rose-500/20 bg-rose-500/10 text-rose-100",
			hover: "group-hover:border-rose-500/30 group-hover:bg-rose-500/20 group-hover:text-rose-50",
			active: "border-rose-500/30 bg-rose-500/20 text-rose-50"
		},
		root: {
			label: "Rascunho",
			base: "border-amber-500/20 bg-amber-500/10 text-amber-100",
			hover:
				"group-hover:border-amber-500/30 group-hover:bg-amber-500/20 group-hover:text-amber-50",
			active: "border-amber-500/30 bg-amber-500/20 text-amber-50"
		},
		fruit: {
			label: "Maduro",
			base: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
			hover:
				"group-hover:border-emerald-500/30 group-hover:bg-emerald-500/20 group-hover:text-emerald-50",
			active: "border-emerald-500/30 bg-emerald-500/20 text-emerald-50"
		}
	} as const;

	const config = $derived(ripenessConfig[ripeness]);
</script>

{#if config}
	<SmartBadge
		{config}
		icon={showIcon ? Sprout : undefined}
		{showLabel}
		{active}
		class={className}
		iconClass="opacity-80"
	/>
{/if}
