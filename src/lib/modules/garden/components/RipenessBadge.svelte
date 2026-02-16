<script lang="ts">
	import type { Ripeness } from "$lib/modules/posts/types";
	import { Sprout } from "@lucide/svelte";
	import { getRipenessLabel } from "$lib/modules/garden/constants";
	import { cn } from "$lib/shared/merge-class";

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

	const token = $derived(`var(--color-ripeness-${ripeness})`);
	const tokenBg = $derived(`var(--color-ripeness-${ripeness}-bg)`);
	const tokenBorder = $derived(`oklch(from var(--color-ripeness-${ripeness}) l c h / 0.32)`);
</script>

<span
	class={cn(
		"inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-xs font-medium transition-colors",
		active ? "text-text" : "text-muted group-hover:text-text",
		className
	)}
	style:background-color={tokenBg}
	style:border-color={tokenBorder}
>
	{#if showIcon}
		<span style:color={token} class={active ? "opacity-100" : "opacity-80 group-hover:opacity-100"}>
			<Sprout size={13} />
		</span>
	{/if}
	{#if showLabel}
		<span class="pt-px">{getRipenessLabel(ripeness)}</span>
	{/if}
</span>
