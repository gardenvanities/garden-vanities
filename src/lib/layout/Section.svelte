<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/shared/merge-class";

	interface Props {
		children: Snippet;
		class?: string;
		as?: string;

		[key: string]: unknown;
	}

	let { children, class: className = "", as = "section", ...rest }: Props = $props();
</script>

<svelte:element this={as} class={cn("py-12 sm:py-20", className)} {...rest}>
	{@render children()}
</svelte:element>
