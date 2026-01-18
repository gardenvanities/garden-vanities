<script lang="ts">
	import type { Kind } from "$lib/modules/posts/types";
	import { Shapes } from "@lucide/svelte";
	import Badge from "$lib/ui/Badge.svelte";

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
	<Badge
		variant="secondary"
		class="group hover:border-primary/50 hover:bg-surface-elevated cursor-default rounded-[4px] px-2 py-0.5 transition-all duration-300 hover:shadow-sm {className}"
		as="span"
	>
		{#if showIcon}
			<span class="-ml-0.5 flex items-center {config.color}">
				<Shapes size={12} strokeWidth={2.5} />
			</span>
		{/if}
		<span class="ml-1.5 pt-px text-[11px] font-medium">{config.label}</span>
	</Badge>
{/if}
