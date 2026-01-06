<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
		class?: string;
		id?: string;
		as?: string;
	}

	let { children, class: className = "", id = undefined, as = "section" }: Props = $props();
</script>

<svelte:element this={as} {id} class="py-12 sm:py-20 {className}">
	{@render children()}
</svelte:element>
