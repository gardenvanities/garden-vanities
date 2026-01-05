<script lang="ts">
	import type { Kind } from "$lib/types";

	interface Props {
		kind: Kind;
		showIcon?: boolean;
	}

	let { kind, showIcon = true }: Props = $props();

	const kindConfig = {
		note: {
			icon: "📝",
			class: "bg-blue-500/15 text-blue-400 border-blue-500/30"
		},
		essay: {
			icon: "✍️",
			class: "bg-purple-500/15 text-purple-400 border-purple-500/30"
		},
		tutorial: {
			icon: "🎓",
			class: "bg-green-500/15 text-green-400 border-green-500/30"
		},
		thought: {
			icon: "💭",
			class: "bg-amber-500/15 text-amber-400 border-amber-500/30"
		}
	} as const;

	const config = $derived(kindConfig[kind] ?? null);
</script>

{#if config}
	<span
		class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1
		       text-xs font-medium capitalize {config.class}"
	>
		{#if showIcon}
			<span class="text-sm">{config.icon}</span>
		{/if}
		{kind}
	</span>
{/if}
