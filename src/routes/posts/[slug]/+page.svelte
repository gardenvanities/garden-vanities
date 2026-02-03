<script lang="ts">
	import PostHeader from "$lib/modules/posts/components/PostHeader.svelte";
	import SeriesNavigation from "$lib/modules/posts/components/SeriesNavigation.svelte";
	import MobileSidebarDrawer from "$lib/modules/posts/components/MobileSidebarDrawer.svelte";
	import ArticleSidebarContent from "$lib/modules/posts/components/ArticleSidebarContent.svelte";
	import PostMetaSidebar from "$lib/modules/posts/components/PostMetaSidebar.svelte";
	import FootnoteTooltip from "$lib/modules/posts/components/FootnoteTooltip.svelte";

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
		// Reset error state when the cover URL changes
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		data.metadata.cover?.url;
		coverError = false;
	});

	onMount(() => {
		// Close sidebar by default on mobile (lg breakpoint is 1024px)
		if (window.innerWidth < 1024) {
			ui.closeSidebar();
		}
	});
</script>

<SEO
	title={data.metadata.seo?.title || data.metadata.title}
	description={data.metadata.seo?.description || data.metadata.summary || data.metadata.subtitle}
	image={data.metadata.cover?.url}
	type="article"
	publishedAt={data.metadata.publishedAt}
	updatedAt={data.metadata.updatedAt}
/>

<!-- Full Width Header -->
<PostHeader metadata={data.metadata} />

<!-- Mobile Sidebar Drawer -->
<MobileSidebarDrawer metadata={data.metadata} />

<!-- Main Content Container containing Article and Sidebar -->
<div class="container mx-auto mt-5 max-w-7xl px-5 lg:px-8">
	<div
		class="flex flex-col gap-10 lg:flex-row lg:gap-10 {!ui.sidebarVisible
			? 'lg:justify-center'
			: ''}"
	>
		<!-- Main Content -->
		<main class="max-w-3xl min-w-0 flex-1">
			<!-- Mobile Metadata (Hidden on Desktop) -->
			<div class="mb-5 lg:hidden">
				<div>
					<PostMetaSidebar metadata={data.metadata} navigation={data.navigation} />
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

			<!-- Article Card Wrapper -->
			<div
				class="lg:border-border/40 lg:bg-surface/30 lg:rounded-xl lg:border lg:px-5 lg:py-5 lg:backdrop-blur-md"
			>
				<div
					id="article-content"
					class="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg max-w-none"
				>
					<data.content />
				</div>
			</div>
		</main>

		<!-- Sidebar -->
		{#if ui.sidebarVisible}
			<aside class="hidden w-[380px] shrink-0 lg:flex lg:flex-col lg:gap-5">
				<!-- Top Sidebar: Metadata (Aligned with Image) -->
				<!-- Static content (scrolls away) -->
				<div
					class="border-border/40 bg-surface/30 rounded-xl border px-5 pt-2 pb-5 backdrop-blur-md"
				>
					<PostMetaSidebar metadata={data.metadata} navigation={data.navigation} />
				</div>

				<!-- Bottom Sidebar: ToC + Progress (Aligned with Article) -->
				<!-- Sticky content -->
				<div
					class="border-border/40 bg-surface/30 sticky top-2 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-xl border px-4 py-3 backdrop-blur-md"
					data-lenis-prevent
				>
					<ArticleSidebarContent metadata={data.metadata} />
				</div>
			</aside>
		{/if}
	</div>
</div>

<div class="container mx-auto max-w-7xl px-5 pb-8 lg:px-8 lg:pb-16">
	<!-- Footer Content (Bloco centralizado, texto à esquerda) -->
	<div class="mx-auto mt-12 max-w-3xl">
		<SeriesNavigation navigation={data.navigation} />

		<Backlinks backlinks={data.backlinks} references={data.references} />
	</div>
</div>

{#key $page.url.pathname}
	<FootnoteTooltip />
{/key}
