<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/shared/merge-class";

	interface Props {
		children: Snippet;
		class?: string;
	}

	let { children, class: className = "" }: Props = $props();
</script>

<kbd
	class={cn(
		"text-muted ring-border/50 bg-surface-elevated shadow-border/5 inline-flex h-5 min-w-5 items-center justify-center rounded px-1 font-mono text-[0.625rem] leading-none font-medium shadow-sm ring-1",
		className
	)}
>
	{@render children()}
</kbd>
