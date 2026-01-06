<script lang="ts">
	import PostAccordion from "$lib/components/garden/PostAccordion.svelte";
	import Container from "$lib/components/layout/Container.svelte";
	import Section from "$lib/components/layout/Section.svelte";
	import SEO from "$lib/components/core/SEO.svelte";
	import type { PostFrontmatter } from "$lib/types";

	interface Props {
		data: {
			posts: PostFrontmatter[];
		};
	}

	let { data }: Props = $props();

	let openSlug = $state<string | null>(null);
</script>

<SEO title="Todos os Artigos | Garden of Vanities" type="website" />

<Section>
	<Container size="sm">
		<header class="mb-12">
			<h1 class="text-text-heading text-3xl font-bold tracking-tight sm:text-4xl">
				Todos os Artigos
			</h1>
			<p class="text-text-muted mt-4 text-lg">O arquivo completo do jardim digital.</p>
		</header>

		<div class="space-y-1">
			{#each data.posts as post (post.slug)}
				<PostAccordion
					{post}
					open={openSlug === post.slug}
					ontoggle={() => (openSlug = openSlug === post.slug ? null : post.slug)}
				/>
			{/each}
		</div>
	</Container>
</Section>
