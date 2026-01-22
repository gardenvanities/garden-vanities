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
		<span class="flex items-center gap-1 rounded-sm border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
			+{remaining}
		</span>
	{/if}
</div>
