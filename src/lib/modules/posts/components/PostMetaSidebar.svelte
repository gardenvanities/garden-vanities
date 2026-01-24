<script lang="ts">
	import type { PostFrontmatter, SerieNavigation } from "$lib/modules/posts/types";
	import { Calendar, Layers, FolderOpen, Sprout, Shapes } from "@lucide/svelte";
	import { formatShortDate } from "$lib/modules/posts/utils/date";

	let { metadata, navigation }: { metadata: PostFrontmatter; navigation?: SerieNavigation } = $props();

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

	function getKindLabel(kind: string) {
		const labels: Record<string, string> = {
			note: "Nota",
			essay: "Ensaio",
			tutorial: "Tutorial",
			thought: "Reflexão"
		};
		return labels[kind] || kind;
	}
</script>

<aside class="text-sm">
	<h4 class="font-sans text-muted mb-4 text-xs font-bold tracking-widest uppercase">Metadados</h4>

	<div class="space-y-3">
		<!-- Kind -->
		{#if metadata.kind}
			<div class="text-muted flex items-center gap-2">
				<Shapes size={14} class="shrink-0 opacity-60" />
				<span class="text-text">{getKindLabel(metadata.kind)}</span>
			</div>
		{/if}

		<!-- Ripeness -->
		{#if metadata.ripeness}
			<div class="text-muted flex items-center gap-2">
				<Sprout size={14} class="shrink-0 opacity-60" />
				<span class="text-text">{getRipenessLabel(metadata.ripeness)}</span>
			</div>
		{/if}		<!-- Date -->
		{#if displayDate}
			<div class="text-muted flex items-center gap-2">
				<Calendar size={14} class="shrink-0 opacity-60" />
				<span class="text-text">{dateLabel} {formatShortDate(displayDate)}</span>
			</div>
		{/if}

		<!-- Series -->
		{#if metadata.series?.slug}
			<div class="text-muted flex items-start gap-2">
				<Layers size={14} class="shrink-0 opacity-60 mt-[4px]" />
				<div>
					<a
						href="/series/{metadata.series.slug}"
						class="text-primary decoration-primary/30 hover:underline underline-offset-4"
					>
						{metadata.series.title || metadata.series.slug}
					</a>
					{#if navigation?.total && metadata.series.order}
						<span class="text-text"> — {metadata.series.order}/{navigation.total}</span>
					{:else if metadata.series.order}
						<span class="text-text"> — #{metadata.series.order}</span>
					{/if}
				</div>
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


</aside>
