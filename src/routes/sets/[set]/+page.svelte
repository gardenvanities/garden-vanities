<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import PostList from "$lib/modules/posts/components/PostList.svelte";
	import { ArrowLeft } from "@lucide/svelte";
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import type { SetMetadata } from "$lib/modules/posts/collections";

	interface Props {
		data: {
			set: SetMetadata;
			posts: PostFrontmatter[];
		};
	}

	let { data }: Props = $props();

	const count = $derived(data.posts.length);
</script>

<SEO
	title="{data.set.title} | Sets do Jardim"
	description={data.set.description || `Notas e ensaios sobre ${data.set.title}`}
/>

<Section class="py-16 md:py-24">
	<Container size="lg">
		<!-- Back Link -->
		<a href="/sets" class="back-link">
			<ArrowLeft size={14} strokeWidth={2} />
			<span>Coleções</span>
		</a>

		<div>
			<!-- Premium Set Header -->
			<header class="page-header">
				<div class="header-content">
					<div class="header-meta">
						<span class="notes-count">
							{count}
							{count === 1 ? "nota" : "notas"}
						</span>
					</div>

					<h1 class="header-title">
						{data.set.title}
					</h1>

					{#if data.set.description}
						<p class="header-description">
							{data.set.description}
						</p>
					{/if}
				</div>
			</header>

			<!-- Posts List -->
			{#if count > 0}
				<PostList posts={data.posts} class="border-border border-t border-b" />
			{:else}
				<div class="empty-state">
					<p>Nenhuma nota encontrada nesta coleção.</p>
				</div>
			{/if}
		</div>
	</Container>
</Section>

<style>
	/* Back Link */
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 2rem;
		padding: 0.5rem 1rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-muted);
		background: oklch(from var(--color-surface) l c h / 0.5);
		border: 1px solid oklch(from var(--color-border) l c h / 0.3);
		transition: all 0.2s ease;
	}

	.back-link:hover {
		color: var(--color-primary);
		background: oklch(from var(--color-primary) l c h / 0.08);
		border-color: oklch(from var(--color-primary) l c h / 0.2);
	}

	/* Page Header */
	.page-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		margin-bottom: 4rem;
	}

	.header-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.header-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.notes-count {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-muted);
	}

	.header-title {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.1;
		color: var(--color-text);
		margin: 0.5rem 0;
	}

	.header-description {
		font-size: 1.125rem;
		line-height: 1.6;
		color: var(--color-muted);
		font-weight: 400;
		max-width: 48ch;
		margin: 0;
	}

	/* Empty State */
	.empty-state {
		padding: 4rem 2rem;
		text-align: center;
	}

	.empty-state p {
		color: var(--color-muted);
		font-style: italic;
	}
</style>
