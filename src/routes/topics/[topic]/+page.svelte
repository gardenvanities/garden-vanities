<script lang="ts">
	import SEO from "$lib/components/core/SEO.svelte";
	import Container from "$lib/components/layout/Container.svelte";
	import Section from "$lib/components/layout/Section.svelte";
	import PostCard from "$lib/components/garden/PostCard.svelte";
	import Grid from "$lib/components/layout/Grid.svelte";
	import { fly } from "svelte/transition";
	import type { PostFrontmatter } from "$lib/types";

	interface Props {
		data: {
			topic: string;
			posts: PostFrontmatter[];
		};
	}

	let { data }: Props = $props();

	const count = $derived(data.posts.length);
</script>

<SEO title="{data.topic} | Tópicos do Jardim" description="Notas e ensaios sobre {data.topic}" />

<Section class="py-12">
	<Container size="lg">
		<header class="mb-12" in:fly={{ y: 20, duration: 800, delay: 100 }}>
			<a
				href="/explore"
				class="text-muted hover:text-primary mb-4 inline-block text-xs font-bold tracking-widest uppercase transition-colors"
			>
				← Voltar à Biblioteca
			</a>
			<h1 class="text-text font-heading text-4xl font-bold">{data.topic}</h1>
			<p class="text-muted mt-2 text-lg">
				{count}
				{count === 1 ? "nota" : "notas"} sobre este tema.
			</p>
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
				<p class="text-muted italic">Nenhuma nota encontrada sobre este tópico.</p>
			</div>
		{/if}
	</Container>
</Section>
