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
	class="group relative flex items-start gap-4 px-4 py-6 transition-all duration-300 md:gap-5"
>
	<!-- Hover Background -->
	<div 
		class="absolute inset-0 rounded-sm bg-linear-to-r from-surface-hover/0 via-surface-hover/50 to-surface-hover/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
	></div>
	


	<!-- Content -->
	<div class="relative z-10 min-w-0 flex-1 flex flex-col">
		<!-- Badges Row -->
		<div class="flex flex-wrap items-center gap-2">
            {#if post.kind}
                <KindBadge kind={post.kind} />
            {/if}
            <RipenessBadge ripeness={post.ripeness} />
		</div>

        <!-- Title & Arrow Row -->
        <div class="relative mt-4 flex items-center justify-between gap-4">
            <!-- Left Accent Line (aligned with title) -->
            <div 
                class="absolute -left-4 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-all duration-300 group-hover:opacity-100 md:-left-5"
            ></div>

            <h3 
                class="font-heading text-text my-0 text-base font-semibold leading-snug tracking-tight transition-colors duration-300 group-hover:text-primary md:text-lg"
            >
                {post.title}
            </h3>

            <!-- Subtle Arrow -->
            <div class="flex shrink-0 items-center">
                <svg 
                    class="h-4 w-4 text-muted/0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" 
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
			<p class="text-muted/70 font-mono mt-1 line-clamp-1 text-sm tracking-normal transition-colors duration-300 group-hover:text-muted">
				{post.subtitle}
			</p>
		{/if}
	</div>


</a>
