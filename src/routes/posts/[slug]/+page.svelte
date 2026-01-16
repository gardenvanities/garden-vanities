<script lang="ts">
	import PostHeader from "$lib/components/garden/posts/PostHeader.svelte";
	import PostNavigation from "$lib/components/garden/posts/PostNavigation.svelte";
	import Backlinks from "$lib/components/garden/Backlinks.svelte";
	import ReadingProgress from "$lib/components/core/ReadingProgress.svelte";
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
	title={metadata.seo?.title || metadata.title}
	description={metadata.seo?.description || metadata.summary || metadata.subtitle}
	type="article"
	publishedAt={metadata.publishedAt}
	updatedAt={metadata.updatedAt}
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
				<div class="prose max-w-none" in:fly={{ y: 20, duration: 800, delay: 300 }}>
					<Content />
				</div>

				{#if navigation}
					<div class="mt-16" in:fly={{ y: 20, duration: 800, delay: 500 }}>
						<PostNavigation {navigation} seriesName={metadata.series?.name} />
					</div>
				{/if}

				<Backlinks {backlinks} references={data.references} />
			</article>

			<!-- Sidebar Direita: Sumário -->
			<div class="relative">
				<div class="sticky top-32 flex flex-col gap-6">
					<!-- Leitura & Progresso -->
					<div in:fly={{ x: 20, duration: 800, delay: 200 }}>
						<ReadingProgress variant="sidebar" />
					</div>
					
					<TableOfContents key={metadata.slug} title={metadata.title} />
				</div>
			</div>
		</div>
	</Container>
</Section>
