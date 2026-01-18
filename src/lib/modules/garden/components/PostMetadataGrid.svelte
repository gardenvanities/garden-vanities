<script lang="ts">
	import TagList from "./TagList.svelte";
	import { formatRelativeDate, formatShortDate, getISODate, isValidDate } from "$lib/modules/posts/utils/date";

	interface Props {
		post: {
			tags?: string[];
			series?: { name: string; order: number; total?: number };
			readingTime?: number;
			readingTimeLabel?: "short" | "medium" | "long";
			publishedAt?: string;
		};
	}

	let { post }: Props = $props();

	function iso(date?: string | Date) {
		if (!date) return undefined;
		if (!isValidDate(date as string)) return undefined;
		return getISODate(date);
	}
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
	<div class="space-y-2">
		<h4 class="text-muted text-[10px] font-bold tracking-widest uppercase">Tags</h4>
		<div class="flex flex-wrap gap-1.5">
			{#if post.tags && post.tags.length > 0}
				<TagList tags={post.tags} limit={3} />
			{:else}
				<p class="text-muted/50 text-xs">Sem tags</p>
			{/if}
		</div>
	</div>

	{#if post.series?.name}
		<div class="space-y-2">
			<h4 class="text-muted text-[10px] font-bold tracking-widest uppercase">Série</h4>
			<p class="text-text text-sm font-medium">
				<span class="text-primary">{post.series.name}</span>
				{#if typeof post.series.order !== "undefined"}
					<span class="text-muted ml-1">
						({post.series.order}{post.series.total ? ` de ${post.series.total}` : ""})
					</span>
				{/if}
			</p>
		</div>
	{/if}

	<div class="space-y-2">
		<h4 class="text-muted text-[10px] font-bold tracking-widest uppercase">Leitura</h4>
		<div>
			<p class="text-text text-sm font-medium capitalize">
				{post.readingTimeLabel || "Curto"}
			</p>
			{#if post.readingTime}
				<p class="text-muted text-[11px]">{post.readingTime} min estimados</p>
			{/if}
		</div>
	</div>

	<div class="space-y-2">
		<h4 class="text-muted text-[10px] font-bold tracking-widest uppercase">Publicado</h4>
		<div>
			{#if post.publishedAt}
				<time datetime={iso(post.publishedAt)} class="text-text block text-sm font-medium">
					{formatShortDate(post.publishedAt)}
				</time>
				<p class="text-muted text-[11px]">{formatRelativeDate(post.publishedAt)}</p>
			{:else}
				<p class="text-muted text-sm">Sem data</p>
			{/if}
		</div>
	</div>
</div>
