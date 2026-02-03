<script lang="ts">
	import ContentCard from "$lib/ui/ContentCard.svelte";
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import KindBadge from "$lib/modules/garden/components/KindBadge.svelte";
	import RipenessBadge from "$lib/modules/garden/components/RipenessBadge.svelte";
	import { cn } from "$lib/shared/merge-class";

	interface Props {
		post: PostFrontmatter;
		class?: string;
	}

	let { post, class: className = "" }: Props = $props();
</script>

<ContentCard
	title={post.title}
	description={post.subtitle || post.summary}
	href="/posts/{post.slug}"
	cover={post.cover}
	class={className}
>
	{#snippet badges()}
		{#if post.kind}
			<KindBadge kind={post.kind} />
		{/if}
		<RipenessBadge ripeness={post.ripeness} />
	{/snippet}
</ContentCard>
