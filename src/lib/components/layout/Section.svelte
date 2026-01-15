<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils/merge-class";

	interface Props {
		children: Snippet;
		class?: string;
		as?: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	}

	let { children, class: className = "", as = "section", ...rest }: Props = $props();
</script>

<svelte:element this={as} class={cn("py-12 sm:py-20", className)} {...rest}>
	{@render children()}
</svelte:element>
