<script lang="ts">
	import type { Component } from "svelte";
	import Badge from "$lib/ui/Badge.svelte";
	interface Props {
		title: string;
		subtitle?: string;
		emoji?: string;
		icon?: Component;
		count?: number;
	}

	let { title, subtitle, emoji, icon: Icon, count }: Props = $props();
</script>

<header class="group relative mb-8">
	<!-- Main Title Row -->
	<div class="flex items-center gap-3">
		<!-- Icon with subtle background -->
		{#if Icon}
			<div class="relative flex items-center justify-center">
				<div class="absolute inset-0 rounded-lg bg-primary/10 blur-sm transition-all duration-300 group-hover:bg-primary/15"></div>
				<div class="relative text-primary">
					<Icon size={24} strokeWidth={1.5} />
				</div>
			</div>
		{:else if emoji}
			<span class="text-2xl">{emoji}</span>
		{/if}

		<!-- Title with gradient effect on hover -->
		<h2 class="font-heading text-text m-0 text-3xl leading-tight font-semibold tracking-tight transition-colors duration-300">
			{title}
		</h2>

		<!-- Optional Count Badge -->
		{#if count !== undefined}
			<Badge variant="secondary" class="px-2.5 font-mono text-xs opacity-60 transition-opacity group-hover:opacity-100">
				{count}
			</Badge>
		{/if}
	</div>

	<!-- Subtitle -->
	{#if subtitle}
		<p class="text-muted mt-3 mb-0 max-w-2xl text-base leading-relaxed pl-9">
			{subtitle}
		</p>
	{/if}

	<!-- Decorative accent line -->
</header>
