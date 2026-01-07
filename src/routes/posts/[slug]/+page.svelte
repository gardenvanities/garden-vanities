<script lang="ts">
	import PostHeader from "$lib/components/garden/posts/PostHeader.svelte";
	import PostNavigation from "$lib/components/garden/posts/PostNavigation.svelte";
	import Backlinks from "$lib/components/garden/Backlinks.svelte";
	import TableOfContents from "$lib/components/garden/TableOfContents.svelte";
	import SEO from "$lib/components/core/SEO.svelte";
	import { fly } from "svelte/transition";
	import Container from "$lib/components/layout/Container.svelte";
	import Section from "$lib/components/layout/Section.svelte";

	let { data } = $props();
	const metadata = $derived(data.metadata);
	const Content = $derived(data.content);
	const navigation = $derived(data.navigation);
	const backlinks = $derived(data.backlinks);
</script>

<SEO
	title={metadata.title}
	description={metadata.subtitle || metadata.excerpt}
	type="article"
	publishedAt={metadata.publishedAt}
	updatedAt={metadata.updatedAt}
	author={metadata.author}
/>

<Section class="py-12! sm:py-20!">
	<Container size="xl">
		<div class="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_minmax(0,680px)_1fr]">
			<!-- Sidebar Esquerda (Espaço vazio ou secundário no futuro) -->
			<div class="hidden lg:block"></div>

			<!-- Coluna Central: Conteúdo -->
			<article>
				<div in:fly={{ y: 20, duration: 800, delay: 100 }}>
					<PostHeader {metadata} />
				</div>

				<!-- Conteúdo do Post -->
				<div
					class="prose prose-zinc prose-invert max-w-none"
					in:fly={{ y: 20, duration: 800, delay: 300 }}
				>
					<Content />
				</div>

				{#if navigation}
					<div class="mt-16" in:fly={{ y: 20, duration: 800, delay: 500 }}>
						<PostNavigation {navigation} seriesName={metadata.series?.name} />
					</div>
				{/if}

				<Backlinks {backlinks} />
			</article>

			<!-- Sidebar Direita: Sumário -->
			<div class="relative">
				<TableOfContents key={metadata.slug} />
			</div>
		</div>
	</Container>
</Section>

<style>
	/* Estilos básicos para o conteúdo mdsvex */
	:global(.prose) {
		line-height: 1.75;
		color: var(--color-text-body);
	}
	:global(.prose p) {
		margin-bottom: 1.5rem;
	}
	:global(.prose h2) {
		margin-top: 3rem;
		margin-bottom: 1.25rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text-heading);
		letter-spacing: -0.02em;
	}
	:global(.prose h3) {
		margin-top: 2rem;
		margin-bottom: 0.75rem;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text-heading);
	}
	:global(.prose ul, .prose ol) {
		margin-bottom: 1.5rem;
		padding-left: 1.25rem;
	}
	:global(.prose li) {
		margin-bottom: 0.5rem;
	}
	:global(.prose strong) {
		color: var(--color-text-heading);
		font-weight: 600;
	}
	:global(.prose blockquote) {
		border-left: 4px solid var(--color-brand-primary);
		padding-left: 1.5rem;
		font-style: italic;
		color: var(--color-text-body);
		margin: 2rem 0;
	}
</style>
