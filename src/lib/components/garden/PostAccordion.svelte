<script lang="ts">
	import { ChevronDown } from "lucide-svelte";
	import { slide } from "svelte/transition";
	import KindBadge from "./KindBadge.svelte";
	import TagList from "./TagList.svelte";

	import type { Post, PostFrontmatter } from "$lib/types";
	import { formatRelativeDate, formatShortDate, getISODate, isValidDate } from "$lib/utils/date";
	import { calculateReadingTime, getReadingTimeLabel } from "$lib/utils/reading-time";

	interface Props {
		post:
			| Post
			| (PostFrontmatter & {
					content?: string;
					readingTime?: number;
					readingTimeLabel?: "short" | "medium" | "long";
			  });
		open?: boolean;
		ontoggle?: () => void;
	}

	let { post, open = false, ontoggle }: Props = $props();

	// safe defaults
	const tags = $derived(post.tags ?? []);
	const subtitle = $derived(post.subtitle ?? "");

	// compute reading time / label (fallback para short se nada disponível)
	const readingMinutes = $derived(
		post.readingTime ?? (post.content ? calculateReadingTime(post.content) : undefined)
	);
	const readingLabel: "short" | "medium" | "long" = $derived(
		post.readingTimeLabel ?? (readingMinutes ? getReadingTimeLabel(readingMinutes) : "short")
	);

	// helper para ISO (usado em datetime)
	function iso(date?: string | Date) {
		if (!date) return undefined;
		if (!isValidDate(date as string)) return undefined;
		return getISODate(date);
	}

	// ids para acessibilidade
	const contentId = $derived(`post-accordion-${post.slug}-content`);
	const headingId = $derived(`post-accordion-${post.slug}-heading`);
</script>

<article class="w-full overflow-hidden border-b-2 border-gray-800">
	<header class="flex justify-between py-6">
		<div class="grow bg-blue-500">
			{#if post.kind}
				<KindBadge kind={post.kind} showIcon={true} />
			{/if}
			<h3 class="text-base leading-tight font-semibold break-keep hyphens-none text-gray-100">
				{post.title}
			</h3>
		</div>
		<button
			id={headingId}
			aria-controls={contentId}
			aria-expanded={open}
			class="flex items-center bg-red-400 focus:outline-none"
			onclick={() => ontoggle?.()}
		>
			<ChevronDown
				class={`ml-6 h-4 w-4 text-gray-400 transition-transform duration-200 ${
					open ? "rotate-180" : "rotate-0"
				}`}
				aria-hidden="true"
			/>
		</button>
	</header>

	{#if open}
		<div
			id={contentId}
			role="region"
			aria-labelledby={headingId}
			in:slide={{ duration: 180 }}
			out:slide={{ duration: 150 }}
			class="pb-4"
		>
			{#if subtitle}
				<p class="mt-1 max-w-prose text-sm text-gray-400">{subtitle}</p>
			{/if}

			<div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
				<!-- Tags -->
				<div>
					<h4 class="text-xs font-medium text-gray-400 uppercase">Tags</h4>
					<div class="mt-2">
						{#if tags.length > 0}
							<TagList {tags} limit={3} />
						{:else}
							<p class="text-sm text-gray-500">Sem tags</p>
						{/if}
					</div>
				</div>

				<!-- Série / ordem -->
				<div>
					<h4 class="text-xs font-medium text-gray-400 uppercase">Série</h4>
					<div class="mt-2">
						{#if post.serie}
							<p class="text-sm text-gray-200">
								<span class="font-medium">{post.serie.name}</span>
								{#if typeof post.serie.order !== "undefined"}
									<span class="text-gray-400"> — ordem {post.serie.order}</span>
								{/if}
							</p>
						{:else}
							<p class="text-sm text-gray-500">Não pertence a uma série</p>
						{/if}
					</div>
				</div>

				<!-- Tempo estimado de leitura -->
				<div>
					<h4 class="text-xs font-medium text-gray-400 uppercase">Tempo estimado</h4>
					<div class="mt-2">
						<p class="text-sm text-gray-200 capitalize">{readingLabel}</p>
						{#if readingMinutes}
							<p class="mt-1 text-xs text-gray-500">{readingMinutes} min (estimado)</p>
						{/if}
					</div>
				</div>

				<!-- Datas -->
				<div>
					<h4 class="text-xs font-medium text-gray-400 uppercase">Publicação</h4>
					<div class="mt-2">
						{#if post.publishedAt}
							<time datetime={iso(post.publishedAt)} class="block text-sm text-gray-200">
								{formatShortDate(post.publishedAt)}
								<span class="text-gray-500">• {formatRelativeDate(post.publishedAt)}</span>
							</time>
						{:else}
							<p class="text-sm text-gray-500">Sem data de publicação</p>
						{/if}

						{#if post.updatedAt && post.updatedAt !== post.publishedAt}
							<time datetime={iso(post.updatedAt)} class="mt-1 block text-xs text-gray-400">
								Atualizado: {formatShortDate(post.updatedAt)}
								<span class="text-gray-500">({formatRelativeDate(post.updatedAt)})</span>
							</time>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}
</article>

<style>
	/* Se quiser, adicione estilos específicos; a maior parte é Tailwind-based. */
</style>
