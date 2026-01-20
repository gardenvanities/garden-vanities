<script lang="ts">
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import { Calendar, Hash, Layers, Network, Sprout } from "@lucide/svelte";
	import { formatShortDate } from "$lib/modules/posts/utils/date";

	let { metadata }: { metadata: PostFrontmatter } = $props();

	const displayDate = $derived(metadata.updatedAt || metadata.publishedAt);
	const dateLabel = $derived(metadata.updatedAt ? "Atualizado" : "Criado");

	function getRipenessLabel(ripeness: string) {
		const labels: Record<string, string> = {
			seed: "Semente",
			root: "Raiz",
			fruit: "Fruto"
		};
		return labels[ripeness] || ripeness;
	}
</script>

<aside class="text-sm">
	<h4 class="text-muted mb-4 text-xs font-bold tracking-widest uppercase">Metadados</h4>

	<div class="space-y-3">
		<!-- Ripeness -->
		{#if metadata.ripeness}
			<div class="text-muted flex items-center gap-2">
				<Sprout size={14} class="shrink-0 opacity-60" />
				<span class="text-text">{getRipenessLabel(metadata.ripeness)}</span>
			</div>
		{/if}

		<!-- Date -->
		{#if displayDate}
			<div class="text-muted flex items-center gap-2">
				<Calendar size={14} class="shrink-0 opacity-60" />
				<span class="text-text">{dateLabel} {formatShortDate(displayDate)}</span>
			</div>
		{/if}

		<!-- Series -->
		{#if metadata.series?.slug}
			<div class="text-muted flex items-center gap-2">
				<Layers size={14} class="shrink-0 opacity-60" />
				<a
					href="/series/{metadata.series.slug}"
					class="text-primary decoration-primary/30 hover:underline underline-offset-4"
				>
					{metadata.series.slug}
				</a>
				{#if metadata.series.order}
					<span class="text-muted text-xs">#{metadata.series.order}</span>
				{/if}
			</div>
		{/if}

		<!-- Set -->
		{#if metadata.set}
			<div class="text-muted flex items-center gap-2">
				<Network size={14} class="shrink-0 opacity-60" />
				<a
					href="/sets/{encodeURIComponent(metadata.set)}"
					class="text-primary decoration-primary/30 hover:underline underline-offset-4"
				>
					{metadata.set}
				</a>
			</div>
		{/if}
	</div>

	<!-- Tags -->
	{#if metadata.tags && metadata.tags.length > 0}
		<div class="border-border mt-4 flex flex-wrap gap-1.5 border-t pt-4">
			{#each metadata.tags as tag}
				<a
					href="/explore?q=%23{encodeURIComponent(tag)}"
					class="text-muted hover:text-primary inline-flex items-center gap-0.5 text-xs transition-colors"
				>
					<Hash size={10} />
					{tag}
				</a>
			{/each}
		</div>
	{/if}
</aside>
