<script lang="ts">
	import type { PostFrontmatter, SerieNavigation } from "$lib/modules/posts/types";
	import { Calendar, Layers, FolderOpen, Sprout, Shapes } from "@lucide/svelte";
	import { formatShortDate } from "$lib/shared/date";
	import { getKindLabel, getRipenessLabel, getKindColorToken } from "$lib/modules/garden/constants";

	interface Props {
		metadata: PostFrontmatter;
		navigation?: SerieNavigation;
		kindDescription?: string;
		setDescription?: string;
		seriesDescription?: string;
	}

	let { metadata, navigation, kindDescription, setDescription, seriesDescription }: Props = $props();

	const displayDate = $derived(metadata.updatedAt || metadata.publishedAt);
	const dateLabel = $derived(metadata.updatedAt ? "atualizado em" : "cultivado em");
	const kindToken = $derived(metadata.kind ? getKindColorToken(metadata.kind) : "kind-note");

	const seriesLabel = $derived(() => {
		const name = metadata.series?.title || metadata.series?.slug || "";
		if (navigation?.total && metadata.series?.order) {
			return `${name} — ${metadata.series.order}/${navigation.total}`;
		}
		return name;
	});
</script>

<aside class="text-sm leading-relaxed">
	<h4 class="text-muted mb-3 font-sans text-xs font-bold tracking-widest uppercase">Propriedades</h4>

	<p class="text-muted-foreground flex flex-wrap items-center gap-x-1.5 gap-y-2">
		{#if metadata.kind}
			<span>Este</span>
			<span
				title={kindDescription}
				class="inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-xs font-medium"
				style:color={`var(--color-${kindToken})`}
				style:background-color={`var(--color-${kindToken}-bg)`}
				style:border-color={`var(--color-${kindToken}-border)`}
			>
				<Shapes size={13} />
				<span class="pt-px">{getKindLabel(metadata.kind)}</span>
			</span>
		{:else}
			<span>Este texto</span>
		{/if}

		{#if metadata.ripeness}
			<span>está no estágio de</span>
			<span
				class="inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-xs font-medium"
				style:color={`var(--color-ripeness-${metadata.ripeness})`}
				style:background-color={`var(--color-ripeness-${metadata.ripeness}-bg)`}
				style:border-color={`oklch(from var(--color-ripeness-${metadata.ripeness}) l c h / 0.32)`}
			>
				<Sprout size={13} />
				<span class="pt-px">{getRipenessLabel(metadata.ripeness)}</span>
			</span>
		{/if}

		{#if displayDate}
			<span>e foi {dateLabel}</span>
			<span
				class="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface-elevated/60 px-2 py-1 text-xs font-medium text-text"
			>
				<Calendar size={13} />
				<span class="pt-px">{formatShortDate(displayDate)}</span>
			</span>
		{/if}

		{#if metadata.set}
			<span>dentro da coleção</span>
			<a href="/sets/{encodeURIComponent(metadata.set)}" title={setDescription}>
				<span class="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface-elevated px-2 py-1 text-xs font-medium text-text hover:bg-surface-hover">
					<FolderOpen size={13} />
					<span class="pt-px">{metadata.setTitle || metadata.set || ""}</span>
				</span>
			</a>
		{/if}

		{#if metadata.series?.slug}
			<span>na série</span>
			<a href="/series/{metadata.series.slug}" title={seriesDescription}>
				<span class="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface-elevated px-2 py-1 text-xs font-medium text-text hover:bg-surface-hover">
					<Layers size={13} />
					<span class="pt-px">{seriesLabel()}</span>
				</span>
			</a>
		{/if}

		<span>.</span>
	</p>
</aside>
