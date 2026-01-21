<script lang="ts">
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import KindBadge from "$lib/modules/garden/components/KindBadge.svelte";

	interface Props {
		post: PostFrontmatter;
		showSummary?: boolean;
	}

	let { post, showSummary = true }: Props = $props();

	// Ripeness indicator colors with glow
	const ripenessStyles: Record<string, { dot: string; glow: string }> = {
		seed: { 
			dot: "bg-rose-400", 
			glow: "shadow-[0_0_8px_rgba(251,113,133,0.5)]" 
		},
		root: { 
			dot: "bg-amber-400", 
			glow: "shadow-[0_0_8px_rgba(251,191,36,0.5)]" 
		},
		fruit: { 
			dot: "bg-emerald-400", 
			glow: "shadow-[0_0_8px_rgba(52,211,153,0.5)]" 
		}
	};

	const style = $derived(ripenessStyles[post.ripeness] || { dot: "bg-muted", glow: "" });
</script>

<a
	href="/posts/{post.slug}"
	class="group relative flex items-start gap-4 px-4 py-4 transition-all duration-300 md:gap-5"
>
	<!-- Hover Background -->
	<div 
		class="absolute inset-0 rounded-sm bg-linear-to-r from-surface-hover/0 via-surface-hover/50 to-surface-hover/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
	></div>
	
	<!-- Left Accent Line (appears on hover) -->
	<div 
		class="absolute left-0 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-all duration-300 group-hover:opacity-100"
	></div>

	<!-- Ripeness Indicator Dot -->
	<div class="relative z-10 mt-1.5 flex shrink-0 items-center justify-center">
		<div 
			class="h-2.5 w-2.5 rounded-full {style.dot} transition-all duration-300 group-hover:scale-110 group-hover:{style.glow}"
		></div>
	</div>

	<!-- Content -->
	<div class="relative z-10 min-w-0 flex-1">
		<!-- Title Row -->
		<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
			<h3 
				class="font-heading text-text text-base font-semibold leading-snug tracking-tight transition-colors duration-300 group-hover:text-primary md:text-lg"
			>
				{post.title}
			</h3>
			
			{#if post.kind}
				<KindBadge kind={post.kind} showIcon={false} class="text-[10px]" />
			{/if}
		</div>

		<!-- Summary -->
		{#if showSummary && post.summary}
			<p class="text-muted/70 mt-1.5 line-clamp-1 text-sm font-light tracking-wide transition-colors duration-300 group-hover:text-muted">
				{post.summary}
			</p>
		{/if}
	</div>

	<!-- Subtle Arrow (appears on hover) -->
	<div class="relative z-10 flex shrink-0 items-center self-center">
		<svg 
			class="h-4 w-4 text-muted/0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" 
			fill="none" 
			stroke="currentColor" 
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
		</svg>
	</div>
</a>
