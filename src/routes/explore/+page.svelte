<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import PostList from "$lib/modules/posts/components/PostList.svelte";
	import PostCard from "$lib/modules/posts/components/PostCard.svelte";
	import PageHeader from "$lib/ui/PageHeader.svelte";
	import { Loader2, LayoutGrid, List } from "@lucide/svelte";
	import viewport from "$lib/actions/viewport";
	import { cn } from "$lib/shared/merge-class";

	let { data } = $props();

	let visibleCount = $state(10);
	let viewMode = $state<"grid" | "list">("grid");

	let displayedPosts = $derived(data.posts.slice(0, visibleCount));

	function loadMore() {
		visibleCount += 10;
	}
</script>

<SEO
	title="Explorar Biblioteca | Garden of Vanities"
	description="Pesquise e filtre todas as notas do jardim."
/>

<Section class="py-16 md:py-24">
	<Container size="lg">
		<div>
			<div class="mb-8 flex flex-col items-center gap-4 relative">
				<PageHeader
					class="mb-0"
					title="Explorar"
					description="Descubra entre {data.posts.length} notas cultivadas"
				/>

				<div class="flex items-center gap-1 rounded-lg border bg-background p-1 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
					<button
						onclick={() => (viewMode = "grid")}
						class={cn(
							"flex h-8 w-8 items-center justify-center rounded-md transition-all",
							viewMode === "grid"
								? "bg-primary text-primary-foreground shadow-sm"
								: "text-muted-foreground hover:bg-muted"
						)}
						aria-label="Grid view"
					>
						<LayoutGrid class="h-4 w-4" />
					</button>
					<button
						onclick={() => (viewMode = "list")}
						class={cn(
							"flex h-8 w-8 items-center justify-center rounded-md transition-all",
							viewMode === "list"
								? "bg-primary text-primary-foreground shadow-sm"
								: "text-muted-foreground hover:bg-muted"
						)}
						aria-label="List view"
					>
						<List class="h-4 w-4" />
					</button>
				</div>
			</div>

			<div class="flex flex-col gap-8">
				{#if viewMode === "list"}
					<PostList posts={displayedPosts} />
				{:else}
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{#each displayedPosts as post (post.slug)}
							<PostCard {post} />
						{/each}
					</div>
				{/if}

				{#if data.posts.length > displayedPosts.length}
					<div
						use:viewport
						onenterViewport={loadMore}
						class="flex w-full items-center justify-center p-4"
					>
						<Loader2 class="text-muted/50 h-6 w-6 animate-spin" />
					</div>
				{/if}
			</div>
		</div>
	</Container>
</Section>
