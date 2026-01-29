<script lang="ts">
	import { cn } from "$lib/shared/merge-class";
	import { Layers } from "@lucide/svelte";
	import CloudinaryImage from "$lib/ui/CloudinaryImage.svelte";

	import { STATUS_LABELS } from "$lib/modules/garden/constants";
	import type { CollectionStatus } from "$lib/modules/posts/collections";

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

<a
	href="/series/{serie.slug}"
	class={cn(
		"group relative block h-[400px] overflow-hidden rounded-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
		className
	)}
>
	<!-- Background Image -->
	{#if serie.cover?.url}
		<CloudinaryImage
			publicId={serie.cover.url}
			alt={serie.cover.alt || serie.title}
			fill={true}
			imgClass="transition-transform duration-500 group-hover:scale-105"
			width={800}
			height={600}
		/>
	{:else}
		<!-- Fallback gradient background -->
		<div class="bg-primary/10 from-primary/20 to-primary/5 absolute inset-0 bg-linear-to-br"></div>
	{/if}

	<!-- Layers Icon - Top Left (Series Identifier) -->
	<div class="absolute top-4 left-4 z-20">
		<div
			class="flex items-center justify-center rounded-sm border border-white/10 bg-black/40 p-2 backdrop-blur-md transition-all duration-300 group-hover:border-white/20 group-hover:bg-black/50"
		>
			<Layers size={16} class="text-white/90" />
		</div>
	</div>

	<!-- Badges - Top Right -->
	<div class="absolute top-4 right-4 z-20 flex items-center gap-2">
		<!-- Post Count Tag -->
		<span
			class="flex items-center gap-1.5 rounded-sm border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md transition-all duration-300 group-hover:border-white/20 group-hover:bg-black/50"
		>
			{serie.postCount}
			{serie.postCount === 1 ? "parte" : "partes"}
		</span>

		<!-- Status Tag -->
		<span
			class="rounded-sm border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md transition-all duration-300 group-hover:border-white/20 group-hover:bg-black/50"
		>
			{statusInfo}
		</span>
	</div>

	<!-- Gradient Overlay (Glass Effect) -->
	<div
		class="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end gap-2 bg-black/60 p-5 pt-24 backdrop-blur-xl transition-all duration-300"
		style="mask-image: linear-gradient(to bottom, transparent 0%, black 50%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 50%);"
	>
		<!-- Title -->
		<h3 class="font-heading text-xl leading-tight font-bold text-white">
			{serie.title}
		</h3>

		<!-- Description -->
		{#if serie.description}
			<p class="line-clamp-2 font-mono text-sm text-white/80">
				{serie.description}
			</p>
		{/if}
	</div>
</a>
