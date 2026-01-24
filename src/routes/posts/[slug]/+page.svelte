<script lang="ts">
	import PostHeader from "$lib/modules/posts/components/PostHeader.svelte";
	import PostNavigation from "$lib/modules/posts/components/PostNavigation.svelte";
	import MobileSidebarDrawer from "$lib/modules/posts/components/MobileSidebarDrawer.svelte";
	import ArticleSidebarContent from "$lib/modules/posts/components/ArticleSidebarContent.svelte";
	import PostMetaSidebar from "$lib/modules/posts/components/PostMetaSidebar.svelte";

	import Backlinks from "$lib/modules/garden/components/Backlinks.svelte";
	import CloudinaryImage from "$lib/ui/CloudinaryImage.svelte";
	import { ui } from "$lib/stores/ui.svelte";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";

	import ReadingProgress from "$lib/modules/posts/components/ReadingProgress.svelte";

	let { data }: { data: PageData } = $props();

	onMount(() => {
		// Close sidebar by default on mobile (lg breakpoint is 1024px)
		if (window.innerWidth < 1024) {
			ui.closeSidebar();
		}
	});
</script>

<svelte:head>
	<title>{data.metadata.title} | The Mage King</title>
</svelte:head>

<!-- Full Width Header -->
<PostHeader metadata={data.metadata} />

<!-- Mobile Sidebar Drawer -->
<MobileSidebarDrawer metadata={data.metadata} />

<!-- Main Content Container containing Article and Sidebar -->
<div class="container mx-auto mt-5 max-w-7xl px-5 lg:px-8">
	<div class="flex flex-col gap-10 lg:flex-row lg:gap-10 {!ui.sidebarVisible ? 'lg:justify-center' : ''}">
		<!-- Main Content -->
		<main class="min-w-0 flex-1 max-w-3xl">
			<!-- Mobile Metadata (Hidden on Desktop) -->
			<div class="mb-5 lg:hidden">
				<div class="rounded-xl border border-border/40 bg-surface/30 px-5 pb-5 pt-2 backdrop-blur-md">
					<PostMetaSidebar metadata={data.metadata} navigation={data.navigation} />
				</div>
			</div>

			{#if data.metadata.cover?.url}
				<div
					class="mb-5 overflow-hidden rounded-xl border border-border/40 bg-surface/50 shadow-sm"
				>
					<CloudinaryImage
						publicId={data.metadata.cover.url}
						alt={data.metadata.cover.alt || data.metadata.title}
						priority={true}
						aspectRatio="1.91/1"
						class="h-full w-full"
					/>
				</div>
			{/if}



			<!-- Article Card Wrapper -->
			<div class="lg:bg-surface/30 lg:border-border/40 lg:backdrop-blur-md lg:rounded-xl lg:border lg:px-5 lg:pb-5 lg:pt-2">
				<div id="article-content" class="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg max-w-none">
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
					class="rounded-xl border border-border/40 bg-surface/30 px-5 pb-5 pt-2 backdrop-blur-md"
				>
					<PostMetaSidebar metadata={data.metadata} navigation={data.navigation} />
				</div>

				<!-- Bottom Sidebar: ToC + Progress (Aligned with Article) -->
				<!-- Sticky content -->
				<div
					class="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-xl border border-border/40 bg-surface/30 p-5 backdrop-blur-md"
					data-lenis-prevent
				>
					<ArticleSidebarContent metadata={data.metadata} navigation={data.navigation} />
				</div>
			</aside>
		{/if}
	</div>
</div>

<div class="container mx-auto px-4 pb-8 lg:px-8 lg:pb-16 max-w-7xl">
	<!-- Footer Content (Bloco centralizado, texto à esquerda) -->
	<div class="mt-12 max-w-3xl mx-auto">
		<PostNavigation navigation={data.navigation} />

		<Backlinks backlinks={data.backlinks} references={data.references} />


	</div>
</div>

<!-- Floating Trigger for Mobile/Desktop -->
<ReadingProgress variant="floating" />
