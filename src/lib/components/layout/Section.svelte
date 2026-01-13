<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils/merge-class";

	interface Props {
		children: Snippet;
		class?: string;
		id?: string;
		as?: string;
	}

	let { children, class: className = "", id = undefined, as = "section" }: Props = $props();
</script>

<svelte:element this={as} {id} class={cn("py-12 sm:py-20", className)}>
	{@render children()}
</svelte:element>
