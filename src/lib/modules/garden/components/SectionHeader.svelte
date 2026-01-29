<script lang="ts">
	import type { Component } from "svelte";

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
				<div
					class="bg-primary/10 group-hover:bg-primary/15 absolute inset-0 rounded-lg blur-sm transition-all duration-300"
				></div>
				<div class="text-primary relative">
					<Icon size={24} strokeWidth={1.5} />
				</div>
			</div>
		{:else if emoji}
			<span class="text-2xl">{emoji}</span>
		{/if}

		<!-- Title with gradient effect on hover -->
		<h2
			class="font-heading text-text m-0 text-3xl leading-tight font-semibold tracking-tight transition-colors duration-300"
		>
			{title}
		</h2>

		<!-- Optional Count Badge -->
		{#if count !== undefined}
			<span
				class="flex items-center gap-1.5 rounded-sm border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all duration-300 group-hover:border-white/20 group-hover:bg-black/50"
			>
				{count}
			</span>
		{/if}
	</div>

	<!-- Subtitle -->
	{#if subtitle}
		<p class="text-muted mt-3 mb-0 max-w-2xl pl-9 text-base leading-relaxed">
			{subtitle}
		</p>
	{/if}

	<!-- Decorative accent line -->
</header>
