<script lang="ts">
	import PostHeader from "$lib/modules/posts/components/PostHeader.svelte";
	import PostNavigation from "$lib/modules/posts/components/PostNavigation.svelte";
	import ArticleSidebarContent from "$lib/modules/posts/components/ArticleSidebarContent.svelte";
	import ArticleFooterMessage from "$lib/modules/posts/components/ArticleFooterMessage.svelte";
	import Backlinks from "$lib/modules/garden/components/Backlinks.svelte";
	import CloudinaryImage from "$lib/ui/CloudinaryImage.svelte";
	import { ui } from "$lib/stores/ui.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.metadata.title} | The Mage King</title>
</svelte:head>

<!-- Full Width Header -->
<PostHeader metadata={data.metadata} />

<!-- Main Content Container containing Article and Sidebar -->
<div class="container mx-auto mt-6 max-w-7xl px-4 lg:px-8">
	<div class="flex flex-col gap-12 lg:flex-row lg:gap-16 {!ui.sidebarVisible ? 'lg:justify-center' : ''}">
		<!-- Main Content -->
		<main class="min-w-0 flex-1 max-w-3xl">
			{#if data.metadata.cover?.url}
				<div
					class="mb-8 overflow-hidden rounded-xl border border-border/40 bg-surface/50 shadow-sm"
				>
					<CloudinaryImage
						publicId={data.metadata.cover.url}
						alt={data.metadata.cover.alt || data.metadata.title}
						priority={true}
						aspectRatio="21/9"
					/>
				</div>
			{/if}

			<!-- Article Card Wrapper -->
			<div class="bg-surface/30 border-border/40 backdrop-blur-md rounded-xl border p-3 lg:p-5">
				<div id="article-content" class="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg max-w-none">
					<data.content />
				</div>
			</div>
		</main>

		<!-- Sidebar -->
		{#if ui.sidebarVisible}
			<aside class="hidden w-[300px] shrink-0 lg:block">
				<div
					class="bg-surface/30 border-border/40 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-xl border p-6 backdrop-blur-md"
					data-lenis-prevent
				>
					<ArticleSidebarContent metadata={data.metadata} />
				</div>
			</aside>
		{/if}
	</div>
</div>

<div class="container mx-auto px-4 pb-8 lg:px-8 lg:pb-16 max-w-7xl">
	<!-- Footer Content (Bloco centralizado, texto à esquerda) -->
	<div class="mt-12 max-w-3xl mx-auto">
		<ArticleFooterMessage />

		<Backlinks backlinks={data.backlinks} references={data.references} />

		<div class="mt-12 border-t border-border pt-12">
			<PostNavigation navigation={data.navigation} />
		</div>
	</div>
</div>
