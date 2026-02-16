<script lang="ts">
	import { Layers } from "@lucide/svelte";
	import { STATUS_LABELS } from "$lib/modules/garden/constants";
	import type { CollectionStatus } from "$lib/modules/posts/collections";
	import CloudinaryImage from "$lib/ui/CloudinaryImage.svelte";
	import { cn } from "$lib/shared/merge-class";

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
	const statusColor = $derived.by(() => {
		if (serie.status === "completed") return "var(--color-success)";
		if (serie.status === "archived") return "var(--color-warning)";
		if (serie.status === "draft") return "var(--color-muted)";
		return "var(--color-primary)";
	});
</script>

<a
	href="/series/{serie.slug}"
	class={cn(
		"group border-border bg-surface hover:border-border-vivid mb-6 block break-inside-avoid overflow-hidden rounded-lg border transition-all duration-200 hover:-translate-y-px hover:shadow-md",
		className
	)}
>
	<div class="from-primary/35 via-primary/10 to-transparent h-1 w-full bg-linear-to-r"></div>

	<div class="border-border/60 relative aspect-[4/3] overflow-hidden border-b">
		{#if serie.cover?.url}
			<CloudinaryImage
				publicId={serie.cover.url}
				alt={serie.cover.alt || serie.title}
				fill={true}
				imgClass="transition-transform duration-500 group-hover:scale-[1.02]"
				width={1200}
				height={900}
			/>
		{:else}
			<div class="bg-surface-elevated absolute inset-0">
				<div
					class="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,var(--color-text)_1px,transparent_0)] bg-size-[18px_18px] opacity-6"
				></div>
				<div class="from-primary/25 absolute inset-0 bg-linear-to-br to-transparent"></div>
			</div>
		{/if}

		<div class="from-bg/75 absolute inset-0 bg-linear-to-t to-transparent"></div>

		<div class="absolute top-3 left-3 z-10">
			<div class="bg-surface/75 border-border/70 text-text inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[11px] font-medium tracking-[0.06em] uppercase backdrop-blur-md">
				<Layers size={14} />
				<span>Série</span>
			</div>
		</div>

		<div class="absolute right-3 bottom-3 z-10">
			<div class="bg-bg/70 border-border/70 text-text inline-flex items-center gap-1 rounded-sm border px-2 py-1 text-[11px] font-medium backdrop-blur-sm">
				<Layers size={12} />
				{serie.postCount}
				{serie.postCount === 1 ? "parte" : "partes"}
			</div>
		</div>

		<div class="absolute top-3 right-3 z-10">
			<div class="bg-bg/70 border-border/70 text-text inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[11px] font-medium backdrop-blur-sm">
				<span class="inline-block h-1.5 w-1.5 rounded-full" style:background-color={statusColor}></span>
				{statusInfo}
			</div>
		</div>
	</div>

	<div class="flex flex-col p-4 sm:p-5">
		<h3 class="font-heading text-text mb-2 text-xl leading-snug font-semibold tracking-tight">
			{serie.title}
		</h3>

		{#if serie.description}
			<p class="text-muted m-0 text-sm leading-relaxed text-pretty">
				{serie.description}
			</p>
		{/if}
	</div>
</a>
