<script lang="ts">
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import KindBadge from "$lib/modules/garden/components/KindBadge.svelte";
	import RipenessBadge from "$lib/modules/garden/components/RipenessBadge.svelte";

	interface Props {
		post: PostFrontmatter;
		showSummary?: boolean;
		seriesBadge?: string;
	}

	let { post, showSummary = true, seriesBadge }: Props = $props();
</script>

<a
	href="/posts/{post.slug}"
	class="group relative flex items-start gap-4 px-4 py-6 transition-all duration-300 md:gap-5"
>
	<!-- Hover Background -->
	<div
		class="from-surface-hover/0 via-surface-hover/50 to-surface-hover/0 absolute inset-0 rounded-sm bg-linear-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"
	></div>

	<!-- Content -->
	<div class="relative z-10 flex min-w-0 flex-1 flex-col">
		<!-- Badges Row -->
		<div class="flex flex-wrap items-center gap-2">
			{#if seriesBadge}
				<span
					class="flex items-center gap-1.5 rounded-sm border border-rose-500/20 bg-rose-500/10 px-2 py-1.5 text-xs font-medium text-rose-100 backdrop-blur-md transition-all duration-300 group-hover:border-rose-500/30 group-hover:bg-rose-500/20 group-hover:text-rose-50"
				>
					<span class="pt-px">{seriesBadge}</span>
				</span>
			{/if}
			{#if post.kind}
				<KindBadge kind={post.kind} />
			{/if}
			<RipenessBadge ripeness={post.ripeness} />
		</div>

		<!-- Title & Arrow Row -->
		<div class="relative mt-4 flex items-center justify-between gap-4">
			<!-- Left Accent Line (aligned with title) -->
			<div
				class="bg-primary absolute top-1/2 -left-4 h-6 w-0.5 -translate-y-1/2 rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100 md:-left-5"
			></div>

			<h3
				class="font-heading text-text group-hover:text-primary my-0 text-base leading-snug font-semibold tracking-tight transition-colors duration-300 md:text-lg"
			>
				{post.title}
			</h3>

			<!-- Subtle Arrow -->
			<div class="flex shrink-0 items-center">
				<svg
					class="text-muted/0 group-hover:text-primary h-4 w-4 transition-all duration-300 group-hover:translate-x-1"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</div>
		</div>

		<!-- Summary -->
		{#if showSummary}
			<p
				class="text-muted/70 group-hover:text-muted mt-1 line-clamp-1 font-mono text-sm tracking-normal transition-colors duration-300"
			>
				{post.subtitle}
			</p>
		{/if}
	</div>
</a>
