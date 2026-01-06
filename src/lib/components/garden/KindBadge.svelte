<script lang="ts">
	import type { Kind } from "$lib/types";
	import { FileText, BookOpen, GraduationCap, Lightbulb } from "lucide-svelte";

	interface Props {
		kind: Kind;
		showIcon?: boolean;
	}

	let { kind, showIcon = true }: Props = $props();

	const kindConfig = {
		note: {
			label: "Nota",
			icon: FileText
		},
		essay: {
			label: "Ensaio",
			icon: BookOpen
		},
		tutorial: {
			label: "Tutorial",
			icon: GraduationCap
		},
		thought: {
			label: "Reflexão",
			icon: Lightbulb
		}
	} as const;

	const config = $derived(kindConfig[kind]);
</script>

{#if config}
	<span class="kind-badge" data-kind={kind}>
		{#if showIcon}
			<config.icon size={12} strokeWidth={2.5} />
		{/if}
		{config.label}
	</span>
{/if}

<style>
	.kind-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-1);
		font-size: var(--type-0);
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		transition: all var(--motion-fast) var(--motion-ease);
	}

	.kind-badge[data-kind="note"] {
		background-color: var(--color-kind-note-bg);
		color: var(--color-kind-note);
		border: 1px solid oklch(from var(--color-kind-note) l c h / 0.2);
	}

	.kind-badge[data-kind="essay"] {
		background-color: var(--color-kind-essay-bg);
		color: var(--color-kind-essay);
		border: 1px solid oklch(from var(--color-kind-essay) l c h / 0.2);
	}

	.kind-badge[data-kind="tutorial"] {
		background-color: var(--color-kind-tutorial-bg);
		color: var(--color-kind-tutorial);
		border: 1px solid oklch(from var(--color-kind-tutorial) l c h / 0.2);
	}

	.kind-badge[data-kind="thought"] {
		background-color: var(--color-kind-thought-bg);
		color: var(--color-kind-thought);
		border: 1px solid oklch(from var(--color-kind-thought) l c h / 0.2);
	}
</style>
