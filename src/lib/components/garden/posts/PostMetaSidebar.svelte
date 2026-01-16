<script lang="ts">
	import type { PostFrontmatter } from "$lib/types";
	import { Calendar, Layers, Network } from "@lucide/svelte";
	import { formatShortDate } from "$lib/utils/date";
	import RipenessBadge from "../RipenessBadge.svelte";
	import KindBadge from "../KindBadge.svelte";
	import TagList from "../TagList.svelte";

	let { metadata }: { metadata: PostFrontmatter } = $props();

	const displayDate = $derived(metadata.updatedAt || metadata.publishedAt);
	const dateLabel = $derived(metadata.updatedAt ? "Atualizado em" : "Criado em");
</script>

<aside class="flex flex-col gap-6 text-sm">
	<!-- About this note -->
	<div class="space-y-4">
		<h4 class="text-xs font-bold tracking-widest text-muted uppercase mb-2">Sobre esta nota</h4>
		
		<!-- Badges Row -->
		<div class="flex flex-wrap gap-2">
			{#if metadata.ripeness}
				<RipenessBadge ripeness={metadata.ripeness} />
			{/if}
			{#if metadata.kind}
				<KindBadge kind={metadata.kind} />
			{/if}
		</div>

		<!-- Date -->
		{#if displayDate}
			<div class="flex items-start gap-3 mt-2">
				<div class="p-1.5 rounded-md bg-surface border border-border text-muted">
					<Calendar size={14} />
				</div>
				<div class="flex flex-col gap-0.5">
					<span class="text-[10px] uppercase font-bold tracking-wider text-muted/70">{dateLabel}</span>
					<time datetime={displayDate} class="font-medium text-text">
						{formatShortDate(displayDate)}
					</time>
				</div>
			</div>
		{/if}
	</div>

	<!-- Context (Series / MoC) -->
	{#if metadata.series || metadata.moc}
		<div class="space-y-4 border-t border-border pt-6">
			<h4 class="text-xs font-bold tracking-widest text-muted uppercase mb-2">Contexto</h4>
			
			{#if metadata.series?.name}
				<div class="flex items-start gap-3">
					<div class="p-1.5 rounded-md bg-surface border border-border text-muted">
						<Layers size={14} />
					</div>
					<div class="flex flex-col gap-0.5">
						<span class="text-[10px] uppercase font-bold tracking-wider text-muted/70">Série</span>
						<span class="font-medium text-primary leading-tight">{metadata.series.name}</span>
						{#if metadata.series.order}
							<span class="text-xs text-muted">Parte {metadata.series.order}{metadata.series.total ? ` de ${metadata.series.total}` : ''}</span>
						{/if}
					</div>
				</div>
			{/if}

			{#if metadata.moc}
				<div class="flex items-start gap-3">
					<div class="p-1.5 rounded-md bg-surface border border-border text-muted">
						<Network size={14} />
					</div>
					<div class="flex flex-col gap-0.5">
						<span class="text-[10px] uppercase font-bold tracking-wider text-muted/70">Map of Content</span>
						<a href="/posts/{metadata.moc}" class="font-medium text-primary hover:underline decoration-primary/30 underline-offset-4 leading-tight">
							{metadata.moc}
						</a>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Tags -->
	{#if metadata.tags && metadata.tags.length > 0}
		<div class="space-y-3 border-t border-border pt-6">
			<h4 class="text-xs font-bold tracking-widest text-muted uppercase mb-2">Tags</h4>
			<TagList tags={metadata.tags} />
		</div>
	{/if}
</aside>
