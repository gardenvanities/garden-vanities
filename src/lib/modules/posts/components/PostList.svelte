<script lang="ts">
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import PostListItem from "./PostListItem.svelte";
	import { fly } from "svelte/transition";

	interface Props {
		posts: PostFrontmatter[];
		showSummary?: boolean;
		class?: string;
	}

	let { posts, showSummary = true, class: className = "" }: Props = $props();
</script>

<div class="divide-border flex flex-col divide-y {className}">
	{#each posts as post, i (post.slug)}
		<div in:fly={{ y: 10, duration: 400, delay: Math.min(i * 50, 500) }}>
			<PostListItem {post} {showSummary} />
		</div>
	{/each}
</div>
