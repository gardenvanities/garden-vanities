<script lang="ts">
	import type { Backlink, LinkReference } from "$lib/modules/posts/types";

	import { fly } from "svelte/transition";
	import PostList from "$lib/modules/posts/components/PostList.svelte";

	interface Props {
		backlinks?: Backlink[];
		references?: LinkReference[];
	}

	let { backlinks = [], references = [] }: Props = $props();

	const sortedReferences = $derived([...references].sort((a, b) => a.title.localeCompare(b.title)));
</script>

{#if backlinks.length > 0 || references.length > 0}
	<div class="mt-24 space-y-16" in:fly={{ y: 20, duration: 800, delay: 600 }}>
		

		{#if backlinks.length > 0}
			<section class="space-y-8">
				<h3 class="font-heading text-text text-lg font-semibold tracking-tight">Mencionado em</h3>

				<PostList posts={backlinks} />
			</section>
		{/if}

		{#if sortedReferences.length > 0}
			<section class="space-y-8">
				<h3 class="font-heading text-text text-lg font-semibold tracking-tight">
					Artigos mencionados
				</h3>

				<PostList posts={sortedReferences} />
			</section>
		{/if}
	</div>
{/if}
