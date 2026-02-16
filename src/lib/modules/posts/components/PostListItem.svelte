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
				class="flex items-center gap-1.5 rounded-sm border px-2 py-1.5 text-xs font-medium backdrop-blur-md transition-all duration-300"
				style:color="var(--color-secondary-foreground)"
				style:background-color="oklch(from var(--color-secondary) l c h / 0.16)"
				style:border-color="oklch(from var(--color-secondary) l c h / 0.36)"
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
