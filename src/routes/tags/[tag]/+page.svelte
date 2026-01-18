<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import PostAccordion from "$lib/modules/posts/components/PostAccordion.svelte";
	import { fly } from "svelte/transition";
	import type { PostFrontmatter } from "$lib/modules/posts/types";

	interface Props {
		data: {
			tag: string;
			posts: PostFrontmatter[];
		};
	}

	let { data }: Props = $props();

	let openSlug = $state<string | null>(null);
	const count = $derived(data.posts.length);
</script>

<SEO title="#{data.tag} | Tags do Jardim" description="Notas e ensaios marcados com #{data.tag}" />

<Section class="py-12">
	<Container size="md">
		<header class="mb-12" in:fly={{ y: 20, duration: 800, delay: 100 }}>
			<a
				href="/"
				class="text-muted hover:text-primary mb-4 inline-block text-xs font-bold tracking-widest uppercase transition-colors"
			>
				← Voltar ao Jardim
			</a>
			<h1 class="text-text font-heading text-4xl font-bold">#{data.tag}</h1>
			<p class="text-muted mt-2 text-lg">
				{count}
				{count === 1 ? "nota" : "notas"} com esta tag.
			</p>
		</header>

		{#if count > 0}
			<div class="space-y-1">
				{#each data.posts as post, i (post.slug)}
					<div in:fly={{ y: 20, duration: 800, delay: 200 + i * 80 }}>
						<PostAccordion
							{post}
							open={openSlug === post.slug}
							ontoggle={() => (openSlug = openSlug === post.slug ? null : post.slug)}
						/>
					</div>
				{/each}
			</div>
		{:else}
			<div class="py-12 text-center">
				<p class="text-muted italic">Nenhuma nota encontrada com esta tag.</p>
			</div>
		{/if}
	</Container>
</Section>
