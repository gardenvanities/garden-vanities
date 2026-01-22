<script lang="ts">
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import KindBadge from "$lib/modules/garden/components/KindBadge.svelte";
	import RipenessBadge from "$lib/modules/garden/components/RipenessBadge.svelte";


	interface Props {
		post: PostFrontmatter;
		showSummary?: boolean;
	}

	let { post, showSummary = true }: Props = $props();
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

	<!-- Content -->
	<div class="relative z-10 min-w-0 flex-1">
		<!-- Badges Row -->
		<div class="mb-1 flex flex-wrap items-center gap-2">
            {#if post.kind}
                <KindBadge kind={post.kind} />
            {/if}
            <RipenessBadge ripeness={post.ripeness} />
		</div>

        <!-- Title -->
        <h3 
            class="w-full font-heading text-text text-base font-semibold leading-snug tracking-tight transition-colors duration-300 group-hover:text-primary md:text-lg"
        >
            {post.title}
        </h3>

		<!-- Summary -->
			<p class="text-muted/70 font-mono mt-1.5 line-clamp-1 text-sm tracking-normal transition-colors duration-300 group-hover:text-muted">
				{post.subtitle}
			</p>
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
