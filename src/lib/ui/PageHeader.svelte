<script lang="ts">
	import { cn } from "$lib/shared/merge-class";
	import type { Snippet } from "svelte";

	interface Props {
		title: string;
		description: string;
		meta?: Snippet;
		class?: string;
	}

	let { title, description, meta, class: className = "" }: Props = $props();
</script>

<header class={cn("mb-16 flex flex-col items-center text-center md:mb-20", className)}>
	<div class="flex flex-col items-center gap-4">
		{#if meta}
			{@render meta()}
		{/if}
		<h1
			class="font-heading text-text my-0 text-[clamp(2.5rem,6vw,4rem)] leading-[1.1] font-bold tracking-[-0.02em]"
		>
			{title}
		</h1>
		<p class="text-muted my-0 max-w-[32ch] text-lg font-normal tracking-[0.01em]">
			{description}
		</p>
	</div>
</header>
