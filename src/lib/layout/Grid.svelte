<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/shared/merge-class";

	interface Props {
		children: Snippet;
		cols?: 1 | 2 | 3 | 4;
		gap?: "sm" | "md" | "lg";
		class?: string;
		as?: string;

		[key: string]: unknown;
	}

	let {
		children,
		cols = 3,
		gap = "md",
		class: className = "",
		as = "div",
		...rest
	}: Props = $props();

	const gridCols = {
		1: "grid-cols-1",
		2: "grid-cols-1 sm:grid-cols-2",
		3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
		4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
	};

	const gaps = {
		sm: "gap-4",
		md: "gap-6",
		lg: "gap-8"
	};
</script>

<svelte:element this={as} class={cn("grid", gridCols[cols], gaps[gap], className)} {...rest}>
	{@render children()}
</svelte:element>
