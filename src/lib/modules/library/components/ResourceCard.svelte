<script lang="ts">
	import type { Resource } from "$lib/modules/library/types";
	import { TYPE_LABELS } from "$lib/modules/library/types";
	import TypeIcon from "./TypeIcon.svelte";
	import ContentCard from "$lib/ui/ContentCard.svelte";

	import { getCreatorName } from "$lib/modules/library/utils";

	interface Props {
		resource: Resource;
		showType?: boolean;
	}

	let { resource, showType = true }: Props = $props();

	const href = $derived(() => {
		const type = resource.type;
		const folder =
			type === "tv-series"
				? "series-tv"
				: type === "album" || type === "track" || type === "playlist"
					? "music"
					: type + "s";
		return `/library/${folder}/${resource.slug}`;
	});

	const creator = $derived(getCreatorName(resource));
</script>

<ContentCard
	title={resource.title}
	description={creator || undefined}
	href={href()}
	cover={resource.cover}
>
	{#snippet icon()}
		{#if showType}
			<div class="flex items-center gap-2">
				<TypeIcon type={resource.type} class="text-text h-4 w-4" aria-hidden="true" />
				<span class="text-text text-xs font-medium tracking-wider uppercase">
					{TYPE_LABELS[resource.type]}
				</span>
			</div>
		{/if}
	{/snippet}
</ContentCard>
