<script lang="ts">
	import PostHeader from "$lib/modules/posts/components/PostHeader.svelte";
	import Cover from "$lib/modules/posts/components/Cover.svelte";
	import PostNavigation from "$lib/modules/posts/components/PostNavigation.svelte";
	import Backlinks from "$lib/modules/garden/components/Backlinks.svelte";
	import ArticleSidebarContent from "$lib/modules/posts/components/ArticleSidebarContent.svelte";
	import MobileSidebarDrawer from "$lib/modules/posts/components/MobileSidebarDrawer.svelte";
	import SEO from "$lib/core/seo/SEO.svelte";
	import { fly, slide } from "svelte/transition";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import { ui } from "$lib/stores/ui.svelte";
	import { onMount } from "svelte";

	let { data } = $props();
	const metadata = $derived(data.metadata);
	const Content = $derived(data.content);
	const navigation = $derived(data.navigation);
	const backlinks = $derived(data.backlinks);

	onMount(() => {
		if (window.innerWidth < 1024) {
			ui.closeSidebar();
		} else {
			ui.openSidebar();
		}
	});
</script>

<SEO
	title={metadata.seo?.title || metadata.title}
	description={metadata.seo?.description || metadata.summary || metadata.subtitle}
	type="article"
	publishedAt={metadata.publishedAt}
	updatedAt={metadata.updatedAt}
/>

<MobileSidebarDrawer {metadata} />

<Section class="py-12! sm:py-20!">
	<Container size="xl">
		<header class="mb-12" in:fly={{ y: 20, duration: 800, delay: 100 }}>
			<PostHeader {metadata} />
		</header>

		<div
			class="grid grid-cols-1 gap-12 transition-[grid-template-columns] duration-500 ease-in-out"
			class:lg:grid-cols-[minmax(200px,280px)_minmax(0,1fr)]={ui.sidebarVisible}
			class:lg:grid-cols-1={!ui.sidebarVisible}
		>
			{#if ui.sidebarVisible}
				<aside
					class="relative order-2 hidden lg:order-1 lg:block"
					transition:slide={{ axis: "x", duration: 400 }}
				>
					<div
						class="scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent sticky top-24 flex max-h-[calc(100vh-8rem)] flex-col gap-6 overflow-y-auto overscroll-y-contain pr-4"
						data-lenis-prevent
					>
						<ArticleSidebarContent {metadata} />
					</div>
				</aside>
			{/if}

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
