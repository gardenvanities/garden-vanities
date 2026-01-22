<script lang="ts">
	import type { Kind } from "$lib/modules/posts/types";
	import { Shapes } from "@lucide/svelte";

	interface Props {
		kind: Kind;
		showIcon?: boolean;
		class?: string;
	}

	let { kind, showIcon = true, class: className = "" }: Props = $props();

	const kindConfig = {
		note: {
			label: "Nota",
			color: "text-kind-note"
		},
		essay: {
			label: "Ensaio",
			color: "text-kind-essay"
		},
		tutorial: {
			label: "Tutorial",
			color: "text-kind-tutorial"
		},
		thought: {
			label: "Reflexão",
			color: "text-kind-thought"
		}
	} as const;

	const config = $derived(kindConfig[kind]);
</script>

{#if config}
	<span
		class="flex items-center gap-1.5 rounded-sm border border-blue-400/20 bg-blue-500/10 px-2 py-1.5 text-xs font-medium text-blue-100 backdrop-blur-md transition-all duration-300 group-hover:border-blue-400/30 group-hover:bg-blue-500/20 group-hover:text-blue-50 {className}"
	>
		{#if showIcon}
			<Shapes size={14} class="text-blue-200/80 group-hover:text-blue-200" />
		{/if}
		<span class="pt-px">{config.label}</span>
	</span>
{/if}
