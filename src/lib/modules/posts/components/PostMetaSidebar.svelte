<script lang="ts">
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import { Calendar, Layers, Network } from "@lucide/svelte";
	import { formatShortDate } from "$lib/modules/posts/utils/date";
	import RipenessBadge from "$lib/modules/garden/components/RipenessBadge.svelte";
	import KindBadge from "$lib/modules/garden/components/KindBadge.svelte";

	let { metadata }: { metadata: PostFrontmatter } = $props();

	const displayDate = $derived(metadata.updatedAt || metadata.publishedAt);
	const dateLabel = $derived(metadata.updatedAt ? "Atualizado em" : "Criado em");
</script>

<aside class="flex flex-col gap-6 text-sm">
	<div class="space-y-4">
		<h4 class="text-muted mb-2 text-xs font-bold tracking-widest uppercase">Sobre esta nota</h4>

		<div class="flex flex-wrap gap-2">
			{#if metadata.ripeness}
				<RipenessBadge ripeness={metadata.ripeness} />
			{/if}
			{#if metadata.kind}
				<KindBadge kind={metadata.kind} />
			{/if}
		</div>

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

	{#if metadata.series || metadata.set}
		<div class="border-border space-y-4 border-t pt-6">
			<h4 class="text-muted mb-2 text-xs font-bold tracking-widest uppercase">Contexto</h4>

			{#if metadata.series?.slug}
				<div class="flex items-start gap-3">
					<div class="bg-surface border-border text-muted rounded-md border p-1.5">
						<Layers size={14} />
					</div>
					<div class="flex flex-col gap-0.5">
						<span class="text-muted/70 text-[10px] font-bold tracking-wider uppercase">Série</span>
						<a
							href="/series/{metadata.series.slug}"
							class="text-primary decoration-primary/30 leading-tight font-medium underline-offset-4 hover:underline"
						>
							{metadata.series.slug}
						</a>
						{#if metadata.series.order}
							<span class="text-muted text-xs">Parte {metadata.series.order}</span>
						{/if}
					</div>
				</div>
			{/if}

			{#if metadata.set}
				<div class="flex items-start gap-3">
					<div class="bg-surface border-border text-muted rounded-md border p-1.5">
						<Network size={14} />
					</div>
					<div class="flex flex-col gap-0.5">
						<span class="text-muted/70 text-[10px] font-bold tracking-wider uppercase">Set</span>
						<a
							href="/sets/{encodeURIComponent(metadata.set)}"
							class="text-primary decoration-primary/30 leading-tight font-medium underline-offset-4 hover:underline"
						>
							{metadata.set}
						</a>
					</div>
				</div>
			{/if}
		</div>
	{/if}

</aside>
