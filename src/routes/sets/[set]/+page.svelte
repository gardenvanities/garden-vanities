<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import PostCard from "$lib/modules/posts/components/PostCard.svelte";
	import Grid from "$lib/layout/Grid.svelte";
	import { FolderOpen, ArrowLeft } from "@lucide/svelte";
	import { fly } from "svelte/transition";
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

<Section class="py-12">
	<Container size="lg">
		<header class="mb-12" in:fly={{ y: 20, duration: 800, delay: 100 }}>
			<a
				href="/sets"
				class="text-muted hover:text-primary mb-4 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors"
			>
				<ArrowLeft size={14} />
				Voltar ao Atlas
			</a>

			<div class="flex items-start gap-4">
				<div
					class="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-xl shrink-0"
				>
					<FolderOpen size={28} />
				</div>

				<div>
					<h1 class="text-text font-heading text-4xl font-bold">{data.set.title}</h1>
					{#if data.set.description}
						<p class="text-muted mt-2 text-lg max-w-2xl">
							{data.set.description}
						</p>
					{/if}
					<p class="text-muted mt-2 text-sm">
						{count}
						{count === 1 ? "nota" : "notas"} neste set.
					</p>
				</div>
			</div>

			<!-- Related Sets -->
			{#if data.set.relatedSets && data.set.relatedSets.length > 0}
				<div class="mt-6 flex items-center gap-2 flex-wrap">
					<span class="text-muted text-xs font-medium">Sets relacionados:</span>
					{#each data.set.relatedSets as relatedSlug (relatedSlug)}
						<a
							href="/sets/{relatedSlug}"
							class="bg-surface-elevated border-border hover:border-primary text-muted hover:text-primary rounded-full border px-3 py-1 text-xs font-medium transition-colors"
						>
							{relatedSlug}
						</a>
					{/each}
				</div>
			{/if}
		</header>

		{#if count > 0}
			<Grid cols={3} gap="lg">
				{#each data.posts as post, i (post.slug)}
					<div in:fly={{ y: 20, duration: 800, delay: 200 + i * 80 }}>
						<PostCard {post} />
					</div>
				{/each}
			</Grid>
		{:else}
			<div class="py-12 text-center">
				<p class="text-muted italic">Nenhuma nota encontrada neste set.</p>
			</div>
		{/if}
	</Container>
</Section>
