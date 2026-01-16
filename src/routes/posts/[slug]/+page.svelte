<script lang="ts">
	import PostHeader from "$lib/components/garden/posts/PostHeader.svelte";
	import Cover from "$lib/components/garden/posts/Cover.svelte";
	import PostNavigation from "$lib/components/garden/posts/PostNavigation.svelte";
	import Backlinks from "$lib/components/garden/Backlinks.svelte";
	import ReadingProgress from "$lib/components/core/ReadingProgress.svelte";
	import PostMetaSidebar from "$lib/components/garden/posts/PostMetaSidebar.svelte";
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
		<!-- 
			LAYOUT STRUCTURE (Based on User Wireframe):
			1. ARTICLE HEADER - Full width
			2. SIDEBAR (left) | ARTICLE CONTENT (right) - 2 columns
			3. ARTICLE COMPONENTS - Full width (Navigation, Backlinks)
		-->

		<!-- ═══════════════════════════════════════════════════════════════════ -->
		<!-- ARTICLE HEADER (Full Width) -->
		<!-- ═══════════════════════════════════════════════════════════════════ -->
		<header class="mb-12" in:fly={{ y: 20, duration: 800, delay: 100 }}>
			<PostHeader {metadata} />
		</header>

		<!-- ═══════════════════════════════════════════════════════════════════ -->
		<!-- SIDEBAR + ARTICLE CONTENT (2-Column Grid) -->
		<!-- ═══════════════════════════════════════════════════════════════════ -->
		<div class="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(200px,280px)_minmax(0,1fr)]">
			<!-- SIDEBAR (Left) -->
			<aside class="relative order-2 hidden lg:order-1 lg:block">
				<div
					class="scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent sticky top-24 flex max-h-[calc(100vh-8rem)] flex-col gap-6 overflow-y-auto overscroll-y-contain pr-4"
					data-lenis-prevent
				>
					<!-- Reading Progress -->
					<div in:fly={{ x: -20, duration: 800, delay: 200 }}>
						<ReadingProgress variant="sidebar" />
					</div>

					<!-- Table of Contents -->
					<div in:fly={{ x: -20, duration: 800, delay: 300 }}>
						<TableOfContents key={metadata.slug} />
					</div>

					<!-- Metadata Card (About this note) -->
					<div in:fly={{ x: -20, duration: 800, delay: 400 }}>
						<PostMetaSidebar {metadata} />
					</div>
				</div>
			</aside>

			<!-- ARTICLE CONTENT (Right) -->
			<article
				id="article-content"
				class="prose order-1 max-w-none lg:order-2"
				in:fly={{ y: 20, duration: 800, delay: 300 }}
			>
				{#if metadata.cover}
					<div class="not-prose mb-12">
						<Cover
							publicId={metadata.cover.url}
							alt={metadata.cover.alt}
							caption={metadata.cover.caption}
							priority={true}
						/>
					</div>
				{/if}

				<Content />
			</article>
		</div>

		<!-- ═══════════════════════════════════════════════════════════════════ -->
		<!-- ARTICLE COMPONENTS (Full Width) -->
		<!-- ═══════════════════════════════════════════════════════════════════ -->
		<div class="mt-16 space-y-12">
			{#if navigation}
				<div in:fly={{ y: 20, duration: 800, delay: 500 }}>
					<PostNavigation {navigation} seriesName={metadata.series?.name} />
				</div>
			{/if}

			<Backlinks {backlinks} references={data.references} />
		</div>
	</Container>
</Section>
