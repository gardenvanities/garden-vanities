<script lang="ts">
	import TagBadge from "./Tag.svelte";
	import Badge from "$lib/ui/Badge.svelte";

	interface Props {
		tags: string[];
		limit?: number;
		onclick?: (tag: string) => void;
	}

	let { tags, limit = 3, onclick }: Props = $props();

	const displayTags = $derived(tags.slice(0, limit));
	const remaining = $derived(Math.max(0, tags.length - limit));
</script>

<div class="flex flex-wrap items-center gap-2">
	{#each displayTags as tag (tag)}
		<TagBadge {tag} {onclick} />
	{/each}

	{#if remaining > 0}
		<Badge variant="outline" class="border-border/50 text-muted/60 bg-surface/50 text-[10px]">
			+{remaining}
		</Badge>
	{/if}
</div>
