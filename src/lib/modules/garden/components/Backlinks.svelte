<script lang="ts">
	import type { Backlink, LinkReference } from "$lib/modules/posts/types";
	import { base } from "$app/paths";
	import { fly } from "svelte/transition";
	import PostListItem from "$lib/modules/posts/components/PostListItem.svelte";

	interface Props {
		backlinks?: Backlink[];
		references?: LinkReference[];
	}

	let { backlinks = [], references = [] }: Props = $props();

	const sortedReferences = $derived([...references].sort((a, b) => a.title.localeCompare(b.title)));
</script>

{#if backlinks.length > 0 || references.length > 0}
	<div
		class="mt-24 space-y-16"
		in:fly={{ y: 20, duration: 800, delay: 600 }}
	>
		<!-- Separator -->
		<hr class="border-border/40" />

		{#if backlinks.length > 0}
			<section class="space-y-8">
				<h3 class="font-heading text-lg font-semibold tracking-tight text-text">
					Mencionado em
				</h3>

				<div class="flex flex-col border-t border-border">
					{#each backlinks as post (post.slug)}
						<div class="border-b border-border">
							<PostListItem {post} showSummary={true} />
						</div>
					{/each}
				</div>
			</section>
		{/if}

		{#if sortedReferences.length > 0}
			<section class="space-y-8">
				<h3 class="font-heading text-lg font-semibold tracking-tight text-text">
					Artigos mencionados
				</h3>

				<div class="flex flex-col border-t border-border">
					{#each sortedReferences as ref (ref.slug)}
						<div class="border-b border-border">
							<PostListItem post={ref} showSummary={true} />
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</div>
{/if}
