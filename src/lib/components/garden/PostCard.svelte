<!-- src/lib/components/posts/PostCard.svelte -->
<script lang="ts">
	import type { PostFrontmatter } from '$lib/types';
	import { Card } from '$lib/components/ui/card';
	import CloudinaryImage from '$lib/components/common/CloudinaryImage.svelte';
	import RipenessIndicator from './RipenessIndicator.svelte';
	import { formatDate } from '$lib/utils/dates';

	export let post: PostFrontmatter;
</script>

<a href="/posts/{post.slug}" class="group block">
	<Card class="overflow-hidden transition-shadow hover:shadow-lg">
		{#if post.cover}
			<CloudinaryImage
				publicId={post.cover.url}
				alt={post.cover.alt}
				width={600}
				aspectRatio="16/9"
			/>
		{/if}

		<div class="p-5">
			<div class="mb-3 flex items-center gap-2">
				<RipenessIndicator ripeness={post.ripeness} />
				{#if post.publishedAt}
					<span class="text-muted-foreground text-xs">
						{formatDate(post.publishedAt)}
					</span>
				{/if}
			</div>

			<h2 class="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
				{post.title}
			</h2>

			{#if post.subtitle}
				<p class="text-muted-foreground mb-3 text-sm">{post.subtitle}</p>
			{/if}

			{#if post.excerpt}
				<p class="line-clamp-3 text-sm">{post.excerpt}</p>
			{/if}

			{#if post.tags?.length}
				<div class="mt-4 flex flex-wrap gap-1.5">
					{#each post.tags.slice(0, 3) as tag (tag)}
						<span class="bg-muted rounded px-2 py-0.5 text-xs">
							{tag}
						</span>
					{/each}
				</div>
			{/if}
		</div>
	</Card>
</a>
