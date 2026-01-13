<script lang="ts">
	import PostAccordion from "$lib/components/garden/PostAccordion.svelte";
	import { fly } from "svelte/transition";
	import Container from "$lib/components/layout/Container.svelte";
	import Section from "$lib/components/layout/Section.svelte";
	import SEO from "$lib/components/core/SEO.svelte";
	import Pagination from "$lib/components/core/Pagination.svelte";
	import type { PostFrontmatter } from "$lib/types";

	interface Props {
		data: {
			posts: PostFrontmatter[];
			currentPage: number;
			totalPages: number;
			pageSize: number;
		};
	}

	let { data }: Props = $props();

	let openSlug = $state<string | null>(null);
</script>

<SEO title="Todos os Artigos | Garden of Vanities" type="website" />

<Section>
	<Container size="sm">
		<header class="mb-12">
			<h1
				class="text-text-heading text-3xl font-bold tracking-tight sm:text-4xl"
				in:fly={{ y: 20, duration: 800, delay: 100 }}
			>
				Todos os Artigos
			</h1>
			<p class="text-text-muted mt-4 text-lg" in:fly={{ y: 20, duration: 800, delay: 200 }}>
				O arquivo completo do jardim digital.
			</p>
		</header>

		<div class="space-y-1">
			{#each data.posts as post, i (post.slug)}
				<div in:fly={{ y: 20, duration: 800, delay: 300 + i * 100 }}>
					<PostAccordion
						{post}
						open={openSlug === post.slug}
						ontoggle={() => (openSlug = openSlug === post.slug ? null : post.slug)}
					/>
				</div>
			{/each}
		</div>

		<div in:fly={{ y: 20, duration: 800, delay: 600 }}>
			<Pagination
				currentPage={data.currentPage}
				totalPages={data.totalPages}
				pageSize={data.pageSize}
				baseUrl="/posts"
			/>
		</div>
	</Container>
</Section>
