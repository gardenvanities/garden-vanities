<!-- eslint-disable svelte/no-navigation-without-resolve -->
<script lang="ts">
	import { base } from "$app/paths";
	import { ChevronDown, ArrowUpRight } from "lucide-svelte";
	import { slide } from "svelte/transition";
	import KindBadge from "./KindBadge.svelte";
	import PostMetadataGrid from "./PostMetadataGrid.svelte";

	import type { Post, PostFrontmatter } from "$lib/types";

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
	const subtitle = $derived(post.subtitle ?? "");

	// helper functions moved to PostMetadataGrid or kept minimal if needed
	const contentId = $derived(`post-accordion-${post.slug}-content`);
	const headingId = $derived(`post-accordion-${post.slug}-heading`);
</script>

<article class="group border-border-default transition-color w-full border-b">
	<div class="flex items-stretch justify-between">
		<!-- Área do Título (Link) -->
		<div class="flex grow flex-col py-5 pr-4">
			{#if post.kind}
				<div class="mb-2">
					<KindBadge kind={post.kind} showIcon={true} />
				</div>
			{/if}
			<a
				href="{base}/posts/{post.slug}"
				class="group/link text-text-heading hover:text-brand-primary block text-base font-semibold tracking-tight transition-colors sm:text-lg"
			>
				{post.title}
				<span class="inline-block align-middle">
					<ArrowUpRight
						size={18}
						class="-translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:translate-y-0 group-hover/link:opacity-100"
					/>
				</span>
			</a>
		</div>

		<!-- Área de Toggle (Botão) -->
		<button
			id={headingId}
			aria-controls={contentId}
			aria-expanded={open}
			class="focus-ring flex items-center justify-end pr-1 pl-4 transition-all"
			onclick={() => ontoggle?.()}
			title={open ? "Recolher detalhes" : "Ver detalhes"}
		>
			<div class="flex h-8 w-8 items-center justify-center transition-colors">
				<ChevronDown
					class={`text-text-muted h-5 w-5 transition-all duration-300 ease-out ${
						open ? "text-brand-primary rotate-180" : "group-hover:text-text-heading rotate-0"
					}`}
					aria-hidden="true"
				/>
			</div>
		</button>
	</div>

	{#if open}
		<div
			id={contentId}
			role="region"
			aria-labelledby={headingId}
			in:slide={{ duration: 250, axis: "y" }}
			out:slide={{ duration: 200, axis: "y" }}
			class="pb-8"
		>
			{#if subtitle}
				<p class="text-text-body/80 mb-6 max-w-2xl text-sm leading-relaxed">{subtitle}</p>
			{/if}

			<PostMetadataGrid {post} />
		</div>
	{/if}
</article>

<style>
	/* Se quiser, adicione estilos específicos; a maior parte é Tailwind-based. */
</style>
