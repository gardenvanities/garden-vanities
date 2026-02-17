<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import CollectionHeader from "$lib/modules/garden/components/CollectionHeader.svelte";
	import PostList from "$lib/modules/posts/components/PostList.svelte";
	import type { SetMetadata } from "$lib/modules/posts/collections";
	import type { PostFrontmatter } from "$lib/modules/posts/types";

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
		<CollectionHeader
			variant="set"
			backHref="/sets"
			backLabel="Coleções"
			title={data.set.title}
			description={data.set.description}
			cover={data.set.cover}
			count={count}
			countLabelSingular="nota"
			countLabelPlural="notas"
		/>

		{#if count > 0}
			<PostList posts={data.posts} class="border-border border-t border-b" />
		{:else}
			<div class="py-16 text-center">
				<p class="text-muted italic">Nenhuma nota encontrada nesta coleção.</p>
			</div>
		{/if}
	</Container>
</Section>
