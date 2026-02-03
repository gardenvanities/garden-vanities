<script lang="ts">
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import KindBadge from "$lib/modules/garden/components/KindBadge.svelte";
	import RipenessBadge from "$lib/modules/garden/components/RipenessBadge.svelte";
	import ListItem from "$lib/ui/ListItem.svelte";

	interface Props {
		post: PostFrontmatter;
		showSummary?: boolean;
		seriesBadge?: string;
		active?: boolean;
		compact?: boolean;
	}

	let {
		post,
		compact = false,
		showSummary = !compact,
		seriesBadge,
		active = false
	}: Props = $props();
</script>

<ListItem
	title={post.title}
	href="/posts/{post.slug}"
	subtitle={showSummary ? post.subtitle : undefined}
	{active}
	class={compact ? "py-2!" : ""}
>
	{#snippet badges()}
		{#if seriesBadge}
			<span
				class="flex items-center gap-1.5 rounded-sm border px-2 py-1.5 text-xs font-medium backdrop-blur-md transition-all duration-300 {active
					? 'border-rose-500/30 bg-rose-500/20 text-rose-50'
					: 'border-rose-500/20 bg-rose-500/10 text-rose-100 group-hover:border-rose-500/30 group-hover:bg-rose-500/20 group-hover:text-rose-50'}"
			>
				<span class="pt-px">{seriesBadge}</span>
			</span>
		{/if}
		{#if post.kind}
			<KindBadge kind={post.kind} {active} />
		{/if}
		<RipenessBadge ripeness={post.ripeness} {active} />
	{/snippet}
</ListItem>
