<script lang="ts">
	import type { Ripeness } from "$lib/modules/posts/types";
	import { Sprout } from "@lucide/svelte";

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
			classes: "border-rose-500/20 bg-rose-500/10 text-rose-100 group-hover:border-rose-500/30 group-hover:bg-rose-500/20 group-hover:text-rose-50"
		},
		root: {
			label: "Rascunho",
			classes: "border-amber-500/20 bg-amber-500/10 text-amber-100 group-hover:border-amber-500/30 group-hover:bg-amber-500/20 group-hover:text-amber-50"
		},
		fruit: {
			label: "Maduro",
			classes: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/20 group-hover:text-emerald-50"
		}
	} as const;

	const config = $derived(ripenessConfig[ripeness]);
</script>

{#if config}
	<span
		class="flex items-center gap-1.5 rounded-sm border px-2 py-1.5 text-xs font-medium backdrop-blur-md transition-all duration-300 {config.classes} {className}"
	>
		{#if showIcon}
			<Sprout size={14} class="opacity-80" />
		{/if}
		{#if showLabel}
			<span class="pt-px">{config.label}</span>
		{/if}
	</span>
{/if}
