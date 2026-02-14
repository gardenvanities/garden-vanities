<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import PostList from "$lib/modules/posts/components/PostList.svelte";
	import { ArrowLeft } from "@lucide/svelte";
	import PageHeader from "$lib/ui/PageHeader.svelte";
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
		
		<a href="/sets" class="back-link">
			<ArrowLeft size={14} strokeWidth={2} />
			<span>Coleções</span>
		</a>

		<div>
			
			<PageHeader title={data.set.title} description={data.set.description || ""}>
				{#snippet meta()}
					<div class="flex items-center gap-2 text-sm text-white/50">
						<span>
							{count}
							{count === 1 ? "nota" : "notas"}
						</span>
					</div>
				{/snippet}
			</PageHeader>

			
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

	 
	.empty-state {
		padding: 4rem 2rem;
		text-align: center;
	}

	.empty-state p {
		color: var(--color-muted);
		font-style: italic;
	}
</style>
