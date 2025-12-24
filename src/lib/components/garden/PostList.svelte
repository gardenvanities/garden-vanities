<!-- src/lib/components/posts/PostList.svelte -->
<script lang="ts">
	import type { PostFrontmatter, Ripeness } from '$lib/types';
	import PostCard from './PostCard.svelte';

	export let posts: PostFrontmatter[];
	export let showFilters: boolean = false;

	let selectedRipeness: Ripeness | 'all' = 'all';
	let selectedTag: string | null = null;

	$: allTags = [...new Set(posts.flatMap((p) => p.tags ?? []))].sort();

	$: filteredPosts = posts.filter((post) => {
		if (selectedRipeness !== 'all' && post.ripeness !== selectedRipeness) {
			return false;
		}
		if (selectedTag && !post.tags?.includes(selectedTag)) {
			return false;
		}
		return true;
	});

	function clearFilters() {
		selectedRipeness = 'all';
		selectedTag = null;
	}
</script>

{#if showFilters}
	<div class="bg-muted/50 mb-8 flex flex-wrap gap-4 rounded-lg p-4">
		<div class="flex flex-col gap-1.5">
			<label for="ripeness-filter" class="text-sm font-medium"> Maturidade </label>
			<select
				id="ripeness-filter"
				bind:value={selectedRipeness}
				class="bg-background rounded-md border px-3 py-1.5 text-sm"
			>
				<option value="all">Todas</option>
				<option value="seed">Semente</option>
				<option value="bud">Botão</option>
				<option value="bloom">Flor</option>
			</select>
		</div>

		{#if allTags.length > 0}
			<div class="flex flex-col gap-1.5">
				<label for="tag-filter" class="text-sm font-medium"> Tag </label>
				<select
					id="tag-filter"
					bind:value={selectedTag}
					class="bg-background rounded-md border px-3 py-1.5 text-sm"
				>
					<option value={null}>Todas</option>
					{#each allTags as tag (tag)}
						<option value={tag}>{tag}</option>
					{/each}
				</select>
			</div>
		{/if}

		{#if selectedRipeness !== 'all' || selectedTag}
			<button
				onclick={clearFilters}
				class="text-muted-foreground hover:text-foreground self-end px-3 py-1.5 text-sm transition-colors"
			>
				Limpar filtros
			</button>
		{/if}
	</div>
{/if}

{#if filteredPosts.length === 0}
	<div class="py-12 text-center">
		<p class="text-muted-foreground">
			{#if posts.length === 0}
				Ainda não há publicações no jardim.
			{:else}
				Nenhuma publicação encontrada com os filtros selecionados.
			{/if}
		</p>
	</div>
{:else}
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each filteredPosts as post (post.slug)}
			<PostCard {post} />
		{/each}
	</div>

	<p class="text-muted-foreground mt-6 text-sm">
		{filteredPosts.length}
		{filteredPosts.length === 1 ? 'publicação' : 'publicações'}
	</p>
{/if}
