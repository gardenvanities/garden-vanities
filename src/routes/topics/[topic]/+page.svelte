<script lang="ts">
	import SEO from "$lib/components/core/SEO.svelte";
	import Container from "$lib/components/layout/Container.svelte";
	import Section from "$lib/components/layout/Section.svelte";
	import PostAccordion from "$lib/components/garden/PostAccordion.svelte";
	import { fly } from "svelte/transition";
	import type { PostFrontmatter } from "$lib/types";

	interface Props {
		data: {
			topic: string;
			posts: PostFrontmatter[];
		};
	}

	let { data }: Props = $props();

	let openSlug = $state<string | null>(null);
	const count = $derived(data.posts.length);
</script>

<SEO title="{data.topic} | Tópicos do Jardim" description="Notas e ensaios sobre {data.topic}" />

<Section class="py-12">
	<Container size="md">
		<header class="mb-12" in:fly={{ y: 20, duration: 800, delay: 100 }}>
			<a
				href="/"
				class="text-text-muted hover:text-brand-primary mb-4 inline-block text-xs font-bold tracking-widest uppercase transition-colors"
			>
				← Voltar ao Jardim
			</a>
			<h1 class="text-text-heading font-serif text-4xl font-bold">{data.topic}</h1>
			<p class="text-text-muted mt-2 text-lg">
				{count}
				{count === 1 ? "nota" : "notas"} sobre este tema.
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
				<p class="text-text-muted italic">Nenhuma nota encontrada sobre este tópico.</p>
			</div>
		{/if}
	</Container>
</Section>
