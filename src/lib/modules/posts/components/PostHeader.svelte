<script lang="ts">
	import type { PostFrontmatter } from "$lib/modules/posts/types";

	interface Props {
		metadata: PostFrontmatter;
	}

	let { metadata }: Props = $props();
</script>

<header
	id="article-header"
	class="from-surface/50 relative flex min-h-[350px] w-full items-end overflow-hidden bg-linear-to-b to-transparent pt-24"
>
	<!-- Content Container (Aligned with Site Layout) -->
	<div class="relative z-10 container mx-auto max-w-7xl px-5 lg:px-8 lg:pb-12">
		<!-- Text Content -->
		<div class="flex w-full flex-col items-start gap-6 text-left lg:items-center lg:text-center">
			<!-- Title -->
			<h1
				class="font-article-title text-text my-0 text-[clamp(2.5rem,5vw,3.5rem)] leading-[1.1] font-bold tracking-[-0.02em] text-balance"
			>
				{metadata.title}
			</h1>

			<!-- Subtitle -->
			{#if metadata.subtitle}
				<p class="font-article-body text-muted my-0 max-w-4xl text-lg leading-snug text-balance">
					{metadata.subtitle}
				</p>
			{/if}
		</div>
	</div>
</header>
