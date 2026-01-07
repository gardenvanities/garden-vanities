<script lang="ts">
	import KindBadge from "$lib/components/garden/KindBadge.svelte";
	import TagList from "$lib/components/garden/TagList.svelte";
	import { ArrowLeft, Clock, Calendar, Layers } from "@lucide/svelte";
	import { formatShortDate } from "$lib/utils/date";
	import type { PostFrontmatter } from "$lib/types";

	import Cover from "./Cover.svelte";

	interface Props {
		metadata: PostFrontmatter;
	}

	let { metadata }: Props = $props();
</script>

<header class="mb-12 space-y-6">
	<a
		href="/"
		class="text-text-muted hover:text-brand-primary mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors"
	>
		<ArrowLeft size={16} />
		Voltar para o jardim
	</a>

	<div>
		{#if metadata.kind}
			<div class="mb-4">
				<KindBadge kind={metadata.kind} />
			</div>
		{/if}

		<h1 class="text-text-heading text-3xl font-bold tracking-tight sm:text-4xl">
			{metadata.title}
		</h1>

		{#if metadata.subtitle}
			<p class="text-text-body/80 mt-4 text-xl leading-relaxed">
				{metadata.subtitle}
			</p>
		{/if}
	</div>

	<div class="border-border-default/50 flex flex-wrap items-center gap-x-8 gap-y-4 border-t pt-6">
		<!-- Data -->
		{#if metadata.publishedAt}
			<div class="text-text-muted flex items-center gap-2 text-sm">
				<Calendar size={16} class="opacity-50" />
				<time datetime={metadata.publishedAt}>
					{formatShortDate(metadata.publishedAt)}
				</time>
			</div>
		{/if}

		<!-- Leitura -->
		{#if metadata.readingTime}
			<div class="text-text-muted flex items-center gap-2 text-sm">
				<Clock size={16} class="opacity-50" />
				<span>{metadata.readingTime} min de leitura</span>
			</div>
		{/if}

		<!-- Série -->
		{#if metadata.series?.name}
			<div class="text-text-muted flex items-center gap-2 text-sm">
				<Layers size={16} class="opacity-50" />
				<span>
					<span class="text-brand-primary font-medium">{metadata.series.name}</span>
					{#if metadata.series.order}
						<span class="opacity-60">
							— {metadata.series.order}{metadata.series.total ? ` de ${metadata.series.total}` : ""}
						</span>
					{/if}
				</span>
			</div>
		{/if}
	</div>

	{#if metadata.tags && metadata.tags.length > 0}
		<div class="pt-2">
			<TagList tags={metadata.tags} limit={10} />
		</div>
	{/if}

	{#if metadata.cover}
		<div class="pt-8">
			<Cover
				publicId={metadata.cover.url}
				alt={metadata.cover.alt}
				caption={metadata.cover.caption}
				priority={true}
			/>
		</div>
	{/if}
</header>
