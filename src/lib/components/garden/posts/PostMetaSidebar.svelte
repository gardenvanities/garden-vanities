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
		<h4 class="text-muted mb-2 text-xs font-bold tracking-widest uppercase">Sobre esta nota</h4>

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
			<div class="mt-2 flex items-start gap-3">
				<div class="bg-surface border-border text-muted rounded-md border p-1.5">
					<Calendar size={14} />
				</div>
				<div class="flex flex-col gap-0.5">
					<span class="text-muted/70 text-[10px] font-bold tracking-wider uppercase"
						>{dateLabel}</span
					>
					<time datetime={displayDate} class="text-text font-medium">
						{formatShortDate(displayDate)}
					</time>
				</div>
			</div>
		{/if}
	</div>

	<!-- Context (Series / MoC) -->
	{#if metadata.series || metadata.moc}
		<div class="border-border space-y-4 border-t pt-6">
			<h4 class="text-muted mb-2 text-xs font-bold tracking-widest uppercase">Contexto</h4>

			{#if metadata.series?.name}
				<div class="flex items-start gap-3">
					<div class="bg-surface border-border text-muted rounded-md border p-1.5">
						<Layers size={14} />
					</div>
					<div class="flex flex-col gap-0.5">
						<span class="text-muted/70 text-[10px] font-bold tracking-wider uppercase">Série</span>
						<span class="text-primary leading-tight font-medium">{metadata.series.name}</span>
						{#if metadata.series.order}
							<span class="text-muted text-xs"
								>Parte {metadata.series.order}{metadata.series.total
									? ` de ${metadata.series.total}`
									: ""}</span
							>
						{/if}
					</div>
				</div>
			{/if}

			{#if metadata.moc}
				<div class="flex items-start gap-3">
					<div class="bg-surface border-border text-muted rounded-md border p-1.5">
						<Network size={14} />
					</div>
					<div class="flex flex-col gap-0.5">
						<span class="text-muted/70 text-[10px] font-bold tracking-wider uppercase"
							>Map of Content</span
						>
						<a
							href="/posts/{metadata.moc}"
							class="text-primary decoration-primary/30 leading-tight font-medium underline-offset-4 hover:underline"
						>
							{metadata.moc}
						</a>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Tags -->
	{#if metadata.tags && metadata.tags.length > 0}
		<div class="border-border space-y-3 border-t pt-6">
			<h4 class="text-muted mb-2 text-xs font-bold tracking-widest uppercase">Tags</h4>
			<TagList tags={metadata.tags} />
		</div>
	{/if}
</aside>
