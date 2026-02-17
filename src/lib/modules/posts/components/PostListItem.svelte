<script lang="ts">
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import KindBadge from "$lib/modules/garden/components/KindBadge.svelte";
	import RipenessBadge from "$lib/modules/garden/components/RipenessBadge.svelte";
	import Badge from "$lib/ui/Badge.svelte";
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
			<Badge
				variant="glass"
				class="transition-all duration-300"
				style="color: var(--color-secondary-foreground); background-color: oklch(from var(--color-secondary) l c h / 0.16); border-color: oklch(from var(--color-secondary) l c h / 0.36);"
			>
				{seriesBadge}
			</Badge>
		{/if}
		{#if post.kind}
			<KindBadge kind={post.kind} {active} />
		{/if}
		<RipenessBadge ripeness={post.ripeness} {active} />
	{/snippet}
</ListItem>
