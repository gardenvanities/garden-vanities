<script lang="ts">
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import { Calendar, Hash, Layers, FolderOpen, Sprout } from "@lucide/svelte";
	import { formatShortDate } from "$lib/modules/posts/utils/date";

	let { metadata }: { metadata: PostFrontmatter } = $props();

	const displayDate = $derived(metadata.updatedAt || metadata.publishedAt);
	const dateLabel = $derived(metadata.updatedAt ? "Atualizado" : "Criado");

	function getRipenessLabel(ripeness: string) {
		const labels: Record<string, string> = {
			seed: "Semente",
			root: "Rascunho",
			fruit: "Maduro"
		};
		return labels[ripeness] || ripeness;
	}
</script>

<aside class="text-sm">
	<h4 class="font-sans text-muted mb-4 text-xs font-bold tracking-widest uppercase">Metadados</h4>

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
					{metadata.series.title || metadata.series.slug}
				</a>
				{#if metadata.series.order}
					<span class="text-muted text-xs">#{metadata.series.order}</span>
				{/if}
			</div>
		{/if}

		<!-- Set -->
		{#if metadata.set}
			<div class="text-muted flex items-center gap-2">
				<FolderOpen size={14} class="shrink-0 opacity-60" />
				<a
					href="/sets/{encodeURIComponent(metadata.set)}"
					class="text-primary decoration-primary/30 hover:underline underline-offset-4"
				>
					{metadata.setTitle || metadata.set}
				</a>
			</div>
		{/if}
	</div>

	<!-- Tags -->
	{#if metadata.tags && metadata.tags.length > 0}
		<div class="border-border mt-6 flex flex-wrap gap-2 border-t pt-6">
			{#each metadata.tags as tag}
				<a
					href="/explore?q=%23{encodeURIComponent(tag)}"
					class="group flex items-center gap-1.5 rounded-sm border border-border bg-surface-elevated/50 px-2.5 py-1 text-xs font-medium text-muted transition-all duration-300 hover:border-primary/40 hover:bg-surface-elevated hover:text-primary"
				>
					<Hash size={11} class="opacity-50 transition-opacity group-hover:opacity-100" />
					{tag}
				</a>
			{/each}
		</div>
	{/if}
</aside>
