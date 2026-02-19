<script lang="ts">
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import KindBadge from "$lib/modules/garden/components/KindBadge.svelte";
	import { getKindColorToken } from "$lib/modules/garden/constants";
	import { fade } from "svelte/transition";

	interface Props {
		post: PostFrontmatter & { readingTime?: number };
	}

	let { post }: Props = $props();

	let kindToken = $derived(post.kind ? getKindColorToken(post.kind) : null);
	let cardBackground = $derived(kindToken ? `var(--color-${kindToken}-card-bg)` : undefined);
	let cardBorder = $derived(kindToken ? `var(--color-${kindToken}-card-border)` : undefined);
	let cardText = $derived(kindToken ? `var(--color-${kindToken}-card-text)` : "var(--color-text)");
</script>

<a
	href="/posts/{post.slug}"
	class="group text-card-foreground mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border-[0.5px] border-(--post-card-border) bg-(--post-card-bg) transition-colors duration-200 hover:bg-surface-hover"
	style="--post-card-bg: {cardBackground ||
		'var(--color-surface)'}; --post-card-border: {cardBorder || 'var(--color-border)'};"
	in:fade={{ duration: 300, delay: 100 }}
>
	<div class="flex flex-col p-4">
		<div class="mb-4 flex justify-start">
			{#if post.kind}
				<KindBadge kind={post.kind} active />
			{/if}
		</div>

		<h3
			class="font-heading mb-2 text-xl leading-snug font-semibold tracking-tight transition-colors group-hover:text-text"
			style:color={cardText}
		>
			{post.title}
		</h3>

		{#if post.subtitle}
			<p class="text-muted m-0 text-sm leading-relaxed">
				{post.subtitle}
			</p>
		{/if}
	</div>
</a>
