<script lang="ts">
	import type { Component } from "svelte";
	interface Props {
		title: string;
		subtitle?: string;
		emoji?: string;
		icon?: Component;
	}

	let { title, subtitle, emoji, icon: Icon }: Props = $props();
</script>

<header class="mb-6 flex items-start gap-4">
	{#if Icon}
		<div class="text-primary flex shrink-0 items-center justify-center text-[2rem] leading-none">
			<Icon size={32} strokeWidth={1.5} />
		</div>
	{:else if emoji}
		<span class="text-primary shrink-0 text-[2rem] leading-none">{emoji}</span>
	{/if}

	<div class="flex-1">
		<h2 class="font-heading text-text m-0 text-2xl font-bold leading-tight">
			{title}
		</h2>
		{#if subtitle}
			<p class="font-article-body text-muted mt-2 mb-0 text-base leading-normal">
				{subtitle}
			</p>
		{/if}
	</div>
</header>
