<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import CollectionHeader from "$lib/modules/garden/components/CollectionHeader.svelte";
	import PostListItem from "$lib/modules/posts/components/PostListItem.svelte";

	let { data } = $props();
</script>

<SEO
	title="{data.series.title} | Séries do Jardim"
	description={data.series.description ||
		`Uma coleção de notas ordenadas sobre ${data.series.title}.`}
/>

<Section class="py-16 md:py-24">
	<Container size="lg">
		<CollectionHeader
			variant="series"
			backHref="/series"
			backLabel="Séries"
			title={data.series.title}
			description={data.series.description}
			cover={data.series.cover}
			status={data.series.status}
			count={data.posts.length}
			countLabelSingular="parte"
			countLabelPlural="partes"
		/>

		<div class="border-border flex flex-col border-t">
			{#each data.posts as post, i (post.slug)}
				<div class="border-border border-b">
					<PostListItem
						{post}
						showSummary={true}
						seriesBadge="Parte {post.series?.order || i + 1}/{data.posts.length}"
					/>
				</div>
			{/each}
			</div>
	</Container>
</Section>
