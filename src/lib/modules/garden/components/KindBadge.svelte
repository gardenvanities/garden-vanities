<script lang="ts">
	import type { Kind } from "$lib/modules/posts/types";
	import { Shapes } from "@lucide/svelte";

	interface Props {
		kind: Kind;
		showIcon?: boolean;
		active?: boolean;
		class?: string;
	}

	let { kind, showIcon = true, active = false, class: className = "" }: Props = $props();

	import SmartBadge from "$lib/ui/SmartBadge.svelte";
	const kindConfig = {
		note: { label: "Nota" },
		essay: { label: "Ensaio" },
		tutorial: { label: "Tutorial" },
		thought: { label: "Reflexão" }
	} as const;

	const blueConfig = {
		base: "border-blue-400/20 bg-blue-500/10 text-blue-100",
		hover: "group-hover:border-blue-400/30 group-hover:bg-blue-500/20 group-hover:text-blue-50",
		active: "border-blue-400/30 bg-blue-500/20 text-blue-50"
	};

	const config = $derived({
		...blueConfig,
		label: kindConfig[kind].label
	});
</script>

{#if config}
	<SmartBadge
		{config}
		icon={showIcon ? Shapes : undefined}
		{active}
		class={className}
		iconClass={active ? "text-blue-200" : "text-blue-200/80 group-hover:text-blue-200"}
	/>
{/if}
