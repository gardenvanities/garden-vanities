<script lang="ts">
	import {
		formatRelativeDate,
		formatShortDate,
		getISODate,
		isValidDate
	} from "$lib/modules/posts/utils/date";

	interface Props {
		post: {
			tags?: string[];
			series?: { slug: string; order: number };
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

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
	{#if post.series?.slug}
		<div class="space-y-2">
			<h4 class="text-muted text-[10px] font-bold tracking-widest uppercase">Série</h4>
			<p class="text-text text-sm font-medium">
				<a href="/series/{post.series.slug}" class="text-primary hover:underline"
					>{post.series.slug}</a
				>
				{#if typeof post.series.order !== "undefined"}
					<span class="text-muted ml-1">
						(Parte {post.series.order})
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
