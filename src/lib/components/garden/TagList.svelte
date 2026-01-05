<!-- src/lib/components/garden/TagList.svelte -->
<script lang="ts">
	import TagBadge from "./Tag.svelte";

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
		<span class="text-xs text-zinc-500">+{remaining} mais</span>
	{/if}
</div>
