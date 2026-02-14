<script lang="ts">
	import type { PostFrontmatter, SerieNavigation } from "$lib/modules/posts/types";
	import { Calendar, Layers, FolderOpen, Sprout, Shapes } from "@lucide/svelte";
	import { formatShortDate } from "$lib/shared/date";
	import { getKindLabel, getRipenessLabel } from "$lib/modules/garden/constants";
	import SmartBadge from "$lib/ui/SmartBadge.svelte";

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

	const kindBadgeConfig = $derived({
		label: metadata.kind ? getKindLabel(metadata.kind) : "",
		base: "border-blue-400/20 bg-blue-500/10 text-blue-100",
		hover: "",
		active: ""
	});

	const ripenessBadgeConfig = $derived({
		label: getRipenessLabel(metadata.ripeness),
		base: "border-emerald-400/20 bg-emerald-500/10 text-emerald-100",
		hover: "",
		active: ""
	});

	const dateBadgeConfig = $derived({
		label: displayDate ? formatShortDate(displayDate) : "",
		base: "border-border bg-surface-elevated/50 text-foreground",
		hover: "",
		active: ""
	});

	const setBadgeConfig = $derived({
		label: metadata.setTitle || metadata.set || "",
		base: "border-amber-400/20 bg-amber-500/10 text-amber-100",
		hover: "hover:bg-amber-500/20",
		active: ""
	});

	const seriesLabel = $derived(() => {
		const name = metadata.series?.title || metadata.series?.slug || "";
		if (navigation?.total && metadata.series?.order) {
			return `${name} — ${metadata.series.order}/${navigation.total}`;
		}
		return name;
	});

	const seriesBadgeConfig = $derived({
		label: seriesLabel(),
		base: "border-violet-400/20 bg-violet-500/10 text-violet-100",
		hover: "hover:bg-violet-500/20",
		active: ""
	});
</script>

<aside class="text-sm leading-relaxed">
	<h4 class="text-muted mb-3 font-sans text-xs font-bold tracking-widest uppercase">Propriedades</h4>

	<p class="text-muted-foreground flex flex-wrap items-center gap-x-1.5 gap-y-2">
		{#if metadata.kind}
			<span>Este</span>
			<span title={kindDescription}>
				<SmartBadge config={kindBadgeConfig} icon={Shapes} />
			</span>
		{:else}
			<span>Este texto</span>
		{/if}

		{#if metadata.ripeness}
			<span>está no estágio de</span>
			<SmartBadge config={ripenessBadgeConfig} icon={Sprout} />
		{/if}

		{#if displayDate}
			<span>e foi {dateLabel}</span>
			<SmartBadge config={dateBadgeConfig} icon={Calendar} />
		{/if}

		{#if metadata.set}
			<span>dentro da coleção</span>
			<a href="/sets/{encodeURIComponent(metadata.set)}" title={setDescription}>
				<SmartBadge config={setBadgeConfig} icon={FolderOpen} />
			</a>
		{/if}

		{#if metadata.series?.slug}
			<span>na série</span>
			<a href="/series/{metadata.series.slug}" title={seriesDescription}>
				<SmartBadge config={seriesBadgeConfig} icon={Layers} />
			</a>
		{/if}

		<span>.</span>
	</p>
</aside>
