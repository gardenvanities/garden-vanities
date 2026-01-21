<script lang="ts">
	import PostHeader from "$lib/modules/posts/components/PostHeader.svelte";
	import PostNavigation from "$lib/modules/posts/components/PostNavigation.svelte";
	import Backlinks from "$lib/modules/garden/components/Backlinks.svelte";
	import ArticleSidebarContent from "$lib/modules/posts/components/ArticleSidebarContent.svelte";
	import MobileSidebarDrawer from "$lib/modules/posts/components/MobileSidebarDrawer.svelte";
	import SEO from "$lib/core/seo/SEO.svelte";
	import { fly } from "svelte/transition";
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

<Section class="py-8! sm:py-12!">
	<Container size="xl">
		<header class="mb-12" in:fly={{ y: 20, duration: 800, delay: 100 }}>
			<PostHeader {metadata} />
		</header>

		<div class="article-layout">
			<!-- Sidebar (Desktop) -->
			<aside
				class="article-sidebar sticky top-24 max-h-[calc(100vh-8rem)] overflow-hidden"
				class:collapsed={!ui.sidebarVisible}
				aria-hidden={!ui.sidebarVisible}
			>
				<div
					class="scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent flex h-full flex-col gap-6 overflow-y-auto pr-4"
					data-lenis-prevent
				>
					<ArticleSidebarContent {metadata} />
				</div>
			</aside>

			<!-- Article Content & Footer -->
			<div class="article-content">
				<article
					id="article-content"
					class="prose mx-auto max-w-3xl"
					in:fly={{ y: 20, duration: 800, delay: 300 }}
				>
					<Content />
					<div class="mt-24 mb-12 mx-auto max-w-xl text-center font-sans text-lg leading-relaxed text-muted/80">
						<p>
							Fico <span class="text-rose-400 font-medium">muito grato</span> pelo seu interesse e por ter <span class="italic text-text/90">lido até o fim</span>!
							Escrever é um <span class="font-medium text-text">ato de diálogo</span> e <span class="text-rose-400">sua atenção</span> é a parte mais importante dessa conversa.
							<span class="block mt-2 font-bold text-base text-text">Obrigado por estar aqui! 😊❤️</span>
						</p>
					</div>
				</article>

				<div class="mx-auto mt-16 max-w-3xl space-y-12">
					{#if navigation}
						<div in:fly={{ y: 20, duration: 800, delay: 500 }}>
							<PostNavigation {navigation} seriesSlug={metadata.series?.slug} />
						</div>
					{/if}

					<Backlinks {backlinks} references={data.references} />
				</div>
			</div>
		</div>
	</Container>
</Section>
