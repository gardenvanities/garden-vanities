<script lang="ts">
	import type { PostFrontmatter } from "$lib/types";
	import { formatRelativeDate } from "$lib/utils/date";
	import KindBadge from "./KindBadge.svelte";
	import RipenessBadge from "./RipenessBadge.svelte";
	import { Library, FolderOpen } from "@lucide/svelte";

	interface Props {
		post: PostFrontmatter;
		compact?: boolean;
	}

	let { post, compact = false }: Props = $props();

	// Normalize slug for series link (using $derived to avoid state_referenced_locally warning)
	let seriesSlug = $derived(
		post.series?.name
			? post.series.name
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/^-+|-+$/g, "")
			: ""
	);
</script>

<div
	class="bg-surface group border-border hover:border-border-vivid relative flex flex-col gap-4 rounded-xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>
	<!-- Main Link Overlay -->
	<a href="/posts/{post.slug}" class="absolute inset-0 z-0" aria-label="Ler {post.title}"></a>

	<div class="relative z-10 flex items-start justify-between gap-4">
		<h3
			class="font-heading text-text group-hover:text-primary text-xl leading-tight font-bold transition-colors"
		>
			{post.title}
		</h3>
		{#if !compact && post.kind}
			<KindBadge kind={post.kind} showIcon={true} class="shrink-0 text-[10px]" />
		{/if}
	</div>

	<!-- Metadata Chips (Clickable) -->
	{#if !compact && (post.moc || post.series)}
		<div class="relative z-10 flex flex-wrap gap-2 text-xs">
			{#if post.moc}
				<a
					href="/topics/{encodeURIComponent(post.moc)}"
					class="bg-surface-elevated text-muted hover:text-primary hover:bg-surface-hover flex items-center gap-1 rounded-md px-2 py-1 transition-colors"
				>
					<FolderOpen size={12} />
					{post.moc}
				</a>
			{/if}
			{#if post.series}
				<a
					href="/series/{seriesSlug}"
					class="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1 rounded-md px-2 py-1 transition-colors"
				>
					<Library size={12} />
					{post.series.name}
					{#if post.series.order}
						<span class="opacity-60">#{post.series.order}</span>
					{/if}
				</a>
			{/if}
		</div>
	{/if}

	{#if post.summary && !compact}
		<p class="text-muted line-clamp-3 text-sm leading-relaxed">
			{post.summary}
		</p>
	{/if}

	<div class="text-muted mt-auto flex items-center justify-between gap-4 pt-2 text-xs">
		<div class="flex items-center gap-2">
			<span>{formatRelativeDate(post.updatedAt ?? post.publishedAt ?? new Date())}</span>
		</div>
		<RipenessBadge ripeness={post.ripeness} showLabel={!compact} />
	</div>
</div>
