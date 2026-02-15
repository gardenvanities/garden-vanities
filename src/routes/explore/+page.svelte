<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import PostMasonryCard from "$lib/modules/posts/components/PostMasonryCard.svelte";
	import ExploreToolbar from "$lib/modules/explore/components/ExploreToolbar.svelte";

	import PageHeader from "$lib/ui/PageHeader.svelte";
	import { Loader2 } from "@lucide/svelte";
	import viewport from "$lib/actions/viewport";

	let { data } = $props();

	
	let searchQuery = $state("");

	let sortBy = $state<"newest" | "oldest" | "az">("newest");
	let visibleCount = $state(10);

	
	let filteredPosts = $derived.by(() => {
		let posts = data.posts;

		if (searchQuery) {
			const terms = searchQuery.toLowerCase().split(/\s+/);
			const tags = terms.filter(t => t.startsWith("#")).map(t => t.slice(1));
			const kinds = terms.filter(t => t.startsWith("?") || t.startsWith("type:")).map(t => t.replace(/^(?:\?|type:)/, ""));
			const textTerms = terms.filter(t => !t.startsWith("#") && !t.startsWith("?") && !t.startsWith("type:"));

			posts = posts.filter((post) => {
				// Filter by Tags (AND logic - must contain all specified tags)
				if (tags.length > 0) {
					const postTags = post.tags?.map(t => t.toLowerCase()) || [];
					const hasAllTags = tags.every(tag => postTags.includes(tag));
					if (!hasAllTags) return false;
				}

				// Filter by Kind (OR logic - can match any of the specified kinds)
				if (kinds.length > 0) {
					// Map "nota" to "note", "ensaio" to "essay" etc if needed? 
					// For now assuming direct mapping or user types english/code keys.
					// Let's support Portuguese aliases for better UX:
					const normalizedKinds = kinds.map(k => {
						if (k === "nota") return "note";
						if (k === "ensaio") return "essay";
						if (k === "pensamento") return "thought";
						if (k === "tutorial") return "tutorial";
						return k;
					});
					
					if (!post.kind || !normalizedKinds.includes(post.kind)) return false;
				}

				// Filter by Text
				if (textTerms.length > 0) {
					const q = textTerms.join(" ");
					const matchTitle = post.title.toLowerCase().includes(q);
					const matchSubtitle = post.subtitle?.toLowerCase().includes(q);
					const matchSummary = post.summary?.toLowerCase().includes(q);
					if (!matchTitle && !matchSubtitle && !matchSummary) return false;
				}

				return true;
			});
		}
		
		return posts;
	});

	
	let sortedPosts = $derived.by(() => {
		const posts = [...filteredPosts];
		switch (sortBy) {
			case "newest":
				return posts.sort((a, b) => {
                    const dateA = new Date(a.publishedAt || 0).getTime();
                    const dateB = new Date(b.publishedAt || 0).getTime();
                    return dateB - dateA;
                });
			case "oldest":
				return posts.sort((a, b) => {
                    const dateA = new Date(a.publishedAt || 0).getTime();
                    const dateB = new Date(b.publishedAt || 0).getTime();
                    return dateA - dateB;
                });
			case "az":
				return posts.sort((a, b) => a.title.localeCompare(b.title));
			default:
				return posts;
		}
	});

	
	let displayedPosts = $derived(sortedPosts.slice(0, visibleCount));
    
    let kindMap = $derived(new Map(data.kinds.map(k => [k.slug, k.color])));

	function loadMore() {
		visibleCount += 10;
	}
</script>

<SEO
	title="Explorar Biblioteca | Garden of Vanities"
	description="Pesquise e filtre todas as notas do jardim."
/>

<Section class="py-12 md:py-20">
	<Container size="xl"> 
		<div class="mb-10 flex flex-col items-center">
			<PageHeader
				class="mb-0 text-center"
				title="Explorar"
				description="Descubra entre {data.posts.length} notas cultivadas"
			/>
		</div>

		<div class="flex flex-col gap-6">
			

			<ExploreToolbar
				bind:sortBy
				bind:searchQuery
			/>

			
			{#if displayedPosts.length > 0}
				<div class="columns-1 sm:columns-2 lg:columns-3 gap-6">
					{#each displayedPosts as post (post.slug)}
						<PostMasonryCard {post} kindColor={post.kind ? kindMap.get(post.kind) : undefined} />
					{/each}
				</div>

				{#if filteredPosts.length > displayedPosts.length}
					<div
						use:viewport
						onenterViewport={loadMore}
						class="flex w-full items-center justify-center p-8"
					>
						<Loader2 class="text-muted/50 h-8 w-8 animate-spin" />
					</div>
				{/if}
			{:else}
				<div class="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/10">
					<p class="text-lg font-medium text-foreground">Nenhum resultado encontrado</p>
					<p class="text-muted-foreground">Tente ajustar seus filtros ou pesquisa.</p>
                    <button 
                        onclick={() => { searchQuery = ""; }}
                        class="mt-4 text-primary hover:underline"
                    >
                        Limpar pesquisa
                    </button>
				</div>
			{/if}
		</div>
	</Container>
</Section>
