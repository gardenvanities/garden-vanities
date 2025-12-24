<!-- src/lib/components/posts/PostHeader.svelte -->
<script lang="ts">
	import type { PostFrontmatter, Author } from '$lib/types';
	import CloudinaryImage from '$lib/components/common/CloudinaryImage.svelte';
	import RipenessIndicator from './RipenessIndicator.svelte';
	import { formatDate, formatRelativeDate } from '$lib/utils/dates';
	import { buildCloudinaryUrl } from '$lib/utils/cloudinary';

	export let post: PostFrontmatter;
	export let author: Author | null = null;

	$: hasUpdated = post.updatedAt && post.updatedAt !== post.publishedAt;
</script>

<header class="mb-10">
	{#if post.cover}
		<div class="-mx-4 mb-8 sm:mx-0">
			<CloudinaryImage
				publicId={post.cover.url}
				alt={post.cover.alt}
				caption={post.cover.caption}
				width={1200}
				aspectRatio="21/9"
				priority={true}
			/>
		</div>
	{/if}

	<div class="mb-4 flex flex-wrap items-center gap-3">
		<RipenessIndicator ripeness={post.ripeness} />

		{#if post.kind}
			<span class="bg-muted rounded-full px-2 py-1 text-xs capitalize">
				{post.kind}
			</span>
		{/if}

		{#if post.series}
			<a
				href="/series/{post.series.name}"
				class="bg-primary/10 text-primary hover:bg-primary/20 rounded-full px-2 py-1 text-xs transition-colors"
			>
				{post.series.name} · Parte {post.series.order}
			</a>
		{/if}
	</div>

	<h1 class="mb-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
		{post.title}
	</h1>

	{#if post.subtitle}
		<p class="text-muted-foreground mb-6 text-xl">
			{post.subtitle}
		</p>
	{/if}

	<div
		class="text-muted-foreground flex flex-wrap items-center gap-4 border-t border-b py-4 text-sm"
	>
		{#if author}
			<a
				href="/author/{author.nick}"
				class="hover:text-foreground flex items-center gap-2 transition-colors"
			>
				{#if author.avatar}
					<img
						src={buildCloudinaryUrl(author.avatar, { width: 40, height: 40, crop: 'thumb' })}
						alt={author.name}
						class="h-8 w-8 rounded-full object-cover"
					/>
				{:else}
					<div class="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
						<span class="text-xs font-medium">
							{author.name.charAt(0).toUpperCase()}
						</span>
					</div>
				{/if}
				<span class="font-medium">{author.name}</span>
			</a>
		{/if}

		{#if post.publishedAt}
			<div class="flex items-center gap-1.5">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				<time datetime={post.publishedAt} title={formatDate(post.publishedAt)}>
					{formatRelativeDate(post.publishedAt)}
				</time>
			</div>
		{/if}

		{#if hasUpdated}
			<div class="flex items-center gap-1.5">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
					/>
				</svg>
				<time datetime={post.updatedAt} title={formatDate(post.updatedAt!)}>
					atualizado {formatRelativeDate(post.updatedAt!)}
				</time>
			</div>
		{/if}
	</div>

	{#if post.tags && post.tags.length > 0}
		<div class="mt-4 flex flex-wrap gap-2">
			{#each post.tags as tag (tag)}
				<a
					href="/?tag={encodeURIComponent(tag)}"
					class="bg-muted hover:bg-muted/80 rounded-full px-2.5 py-1 text-xs transition-colors"
				>
					#{tag}
				</a>
			{/each}
		</div>
	{/if}
</header>
