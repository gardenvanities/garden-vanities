<script lang="ts">
	import PostHeader from "$lib/modules/posts/components/PostHeader.svelte";
	import SeriesNavigation from "$lib/modules/posts/components/SeriesNavigation.svelte";
	import PostMetaSidebar from "$lib/modules/posts/components/PostMetaSidebar.svelte";
	import FootnoteTooltip from "$lib/modules/posts/components/FootnoteTooltip.svelte";
	import ArticleSidebar from "$lib/modules/posts/components/ArticleSidebar.svelte";

	import Backlinks from "$lib/modules/garden/components/Backlinks.svelte";
	import CloudinaryImage from "$lib/ui/CloudinaryImage.svelte";
	import SEO from "$lib/core/seo/SEO.svelte";
	import { ui } from "$lib/stores/ui.svelte";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	let coverError = $state(false);

	$effect(() => {
		
		
		void data.metadata.cover?.url;
		coverError = false;
	});

	onMount(() => {
		
		if (window.innerWidth < 1024) {
			ui.closeSidebar();
			ui.closeArticleSidebar();
		}
	});

	let isArticleSidebarExpanded = $derived(ui.articleSidebarExpanded);
</script>

<SEO
	title={data.metadata.seo?.title || data.metadata.title}
	description={data.metadata.seo?.description || data.metadata.summary || data.metadata.subtitle}
	image={data.metadata.cover?.url}
	type="article"
	publishedAt={data.metadata.publishedAt}
	updatedAt={data.metadata.updatedAt}
/>








<div class="container mx-auto mt-5 max-w-7xl px-5 lg:px-8">
		<div
			class="flex flex-col gap-10 transition-all duration-300 ease-entrance"
			class:lg:mr-[260px]={isArticleSidebarExpanded}
			class:lg:mr-[48px]={!isArticleSidebarExpanded}
		>
		
		<main class="min-w-0 flex-1 mx-auto max-w-3xl w-full">
			<PostHeader metadata={data.metadata} />
			
			<div class="mb-8">
				<div>
					<PostMetaSidebar
					metadata={data.metadata}
					navigation={data.navigation}
					kindDescription={data.kindDescription}
					setDescription={data.setDescription}
					seriesDescription={data.seriesDescription}
				/>
				</div>
			</div>

			{#if data.metadata.cover?.url}
				{@const coverUrl = data.metadata.cover.url}
				<div
					class="border-border/40 bg-surface/50 mb-5 overflow-hidden rounded-xl border shadow-sm transition-opacity duration-300"
					class:hidden={coverUrl === "" || coverError}
				>
					<CloudinaryImage
						publicId={coverUrl}
						alt={data.metadata.cover.alt || data.metadata.title}
						priority={true}
						aspectRatio="1.91/1"
						class="h-full w-full"
						onError={() => (coverError = true)}
					/>
				</div>
			{/if}

			
			<div class="mt-8">
				<div
					id="article-content"
					class="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg max-w-none"
				>
					<data.content />
				</div>
			</div>
		</main>

		
	</div>
</div>

<ArticleSidebar metadata={data.metadata} />

<div class="container mx-auto max-w-7xl px-5 pb-8 lg:px-8 lg:pb-16">
	
	<div class="mx-auto mt-12 max-w-3xl">
		<SeriesNavigation navigation={data.navigation} />

		<Backlinks backlinks={data.backlinks} references={data.references} />
	</div>
</div>

{#key $page.url.pathname}
	<FootnoteTooltip />
{/key}

<style>
	:global {
		@import '../../../styles/prose.css';
	}
</style>
