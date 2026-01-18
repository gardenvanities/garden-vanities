<script lang="ts">
	import type { Kind } from "$lib/modules/posts/types";
	import { FileText, BookOpen, GraduationCap, Lightbulb } from "@lucide/svelte";
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
	<Badge
		variant="outline"
		class="gap-1.5 rounded-[4px] border px-2 py-0.5 font-bold tracking-widest uppercase shadow-sm backdrop-blur-sm {config.color} {className}"
		as="span"
	>
		{#if showIcon}
			<span class="-ml-0.5 flex items-center opacity-80">
				<config.icon size={12} strokeWidth={2.5} />
			</span>
		{/if}
		<span class="pt-[1px] text-[10px] sm:text-[11px]">{config.label}</span>
	</Badge>
{/if}
