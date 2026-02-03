<script lang="ts">
	import { Layers } from "@lucide/svelte";
	import { STATUS_LABELS } from "$lib/modules/garden/constants";
	import type { CollectionStatus } from "$lib/modules/posts/collections";
	import ContentCard from "$lib/ui/ContentCard.svelte";
	import Badge from "$lib/ui/Badge.svelte";

	interface SeriesItem {
		slug: string;
		title: string;
		description?: string;
		cover?: { url: string; alt?: string };
		status: CollectionStatus;
		postCount: number;
	}

	interface Props {
		serie: SeriesItem;
		class?: string;
	}

	let { serie, class: className = "" }: Props = $props();

	const statusInfo = $derived(STATUS_LABELS[serie.status] || STATUS_LABELS.ongoing);
</script>

<ContentCard
	title={serie.title}
	description={serie.description}
	href="/series/{serie.slug}"
	cover={serie.cover}
	class={className}
>
	{#snippet icon()}
		<Layers size={16} class="text-white/90" />
	{/snippet}

	{#snippet badges()}
		<Badge variant="glass">
			{serie.postCount}
			{serie.postCount === 1 ? "parte" : "partes"}
		</Badge>

		<Badge variant="glass">
			{statusInfo}
		</Badge>
	{/snippet}
</ContentCard>
