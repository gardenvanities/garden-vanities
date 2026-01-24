<script lang="ts">
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import { fade, fly } from "svelte/transition";
	import CloudinaryImage from "$lib/ui/CloudinaryImage.svelte";

	interface Props {
		metadata: PostFrontmatter;
	}

	let { metadata }: Props = $props();
</script>

<header class="relative flex min-h-[350px] w-full items-end overflow-hidden border-b border-border/10 bg-linear-to-b from-surface/50 to-transparent pt-24">
	<!-- Content Container (Aligned with Site Layout) -->
	<div class="container relative z-10 mx-auto max-w-7xl px-4 lg:px-8 lg:pb-12">
		<!-- Text Content -->
		<div class="flex w-full flex-col items-start gap-6 text-left lg:items-center lg:text-center">


			<!-- Title -->
			<h1
				class="font-article-title my-0 text-balance text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-text"
				in:fly={{ y: 20, duration: 600, delay: 150 }}
			>
				{metadata.title}
			</h1>

			<!-- Subtitle -->
			{#if metadata.subtitle}
				<p
					class="font-article-body my-0 max-w-4xl text-balance text-lg leading-snug text-muted"
					in:fly={{ y: 15, duration: 500, delay: 250 }}
				>
					{metadata.subtitle}
				</p>
			{/if}
		</div>
	</div>
</header>
