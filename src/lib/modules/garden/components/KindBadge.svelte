<script lang="ts">
	import type { Kind } from "$lib/modules/posts/types";
	import { Shapes } from "@lucide/svelte";
	import { getKindColorToken, getKindDescription, getKindLabel } from "$lib/modules/garden/constants";
	import { cn } from "$lib/shared/merge-class";
	import Badge from "$lib/ui/Badge.svelte";

	interface Props {
		kind: Kind;
		showIcon?: boolean;
		active?: boolean;
		class?: string;
	}

	let { kind, showIcon = true, active = false, class: className = "" }: Props = $props();

	const label = $derived(getKindLabel(kind));
	const description = $derived(getKindDescription(kind));
	const colorToken = $derived(getKindColorToken(kind));
	const color = $derived(`var(--color-${colorToken})`);
	const colorBg = $derived(`var(--color-${colorToken}-bg)`);
	const colorBorder = $derived(`var(--color-${colorToken}-border)`);
</script>

<span
	class="kind-badge-wrap group/kind relative inline-flex"
	role="note"
	aria-label={description}
>
	<Badge
		class={cn(active ? "text-text" : "text-muted group-hover/kind:text-text", className)}
		style="background-color: {colorBg}; border-color: {colorBorder};"
	>
		{#if showIcon}
			<span
				style:color={color}
				class={active ? "opacity-100" : "opacity-80 group-hover/kind:opacity-100"}
			>
				<Shapes size={13} />
			</span>
		{/if}
		<span>{label}</span>
	</Badge>

	<div
		role="tooltip"
		class="pointer-events-none absolute top-[calc(100%+8px)] left-1/2 z-50 w-56 -translate-x-1/2 rounded-sm border px-2.5 py-2 text-xs leading-relaxed opacity-0 shadow-md transition-opacity duration-150 group-hover/kind:opacity-100 group-focus-within/kind:opacity-100"
		style:background-color="var(--color-surface-elevated)"
		style:border-color="var(--color-border)"
		style:color="var(--color-text)"
	>
		{description}
	</div>
</span>
