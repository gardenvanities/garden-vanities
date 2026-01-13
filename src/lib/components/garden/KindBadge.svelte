<script lang="ts">
	import type { Kind } from "$lib/types";
	import { FileText, BookOpen, GraduationCap, Lightbulb } from "@lucide/svelte";

	import { cn } from "$lib/utils/merge-class";

	interface Props {
		kind: Kind;
		showIcon?: boolean;
		class?: string;
	}

	let { kind, showIcon = true, class: className = "" }: Props = $props();

	const kindConfig = {
		note: {
			label: "Nota",
			icon: FileText,
			color: "text-kind-note bg-kind-note-bg border-kind-note/20"
		},
		essay: {
			label: "Ensaio",
			icon: BookOpen,
			color: "text-kind-essay bg-kind-essay-bg border-kind-essay/20"
		},
		tutorial: {
			label: "Tutorial",
			icon: GraduationCap,
			color: "text-kind-tutorial bg-kind-tutorial-bg border-kind-tutorial/20"
		},
		thought: {
			label: "Reflexão",
			icon: Lightbulb,
			color: "text-kind-thought bg-kind-thought-bg border-kind-thought/20"
		}
	} as const;

	const config = $derived(kindConfig[kind]);
</script>

{#if config}
	<span
		class={cn(
			"inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-bold tracking-widest uppercase transition-colors",
			config.color,
			className
		)}
		data-kind={kind}
	>
		{#if showIcon}
			<config.icon size={12} strokeWidth={2.5} />
		{/if}
		{config.label}
	</span>
{/if}
