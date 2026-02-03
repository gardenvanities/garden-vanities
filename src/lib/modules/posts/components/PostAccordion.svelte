<script lang="ts">
	import { base } from "$app/paths";
	import { ChevronDown, ArrowUpRight } from "@lucide/svelte";
	import { slide } from "svelte/transition";
	import KindBadge from "$lib/modules/garden/components/KindBadge.svelte";
	import PostMetaSidebar from "$lib/modules/posts/components/PostMetaSidebar.svelte";

	import type { Post, PostFrontmatter } from "$lib/modules/posts/types";

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

	const subtitle = $derived(post.subtitle ?? "");

	const contentId = $derived(`post-accordion-${post.slug}-content`);
	const headingId = $derived(`post-accordion-${post.slug}-heading`);
</script>

<article class="group border-border transition-color w-full border-b">
	<div class="flex items-stretch justify-between">
		<div class="flex grow flex-col py-5 pr-4">
			{#if post.kind}
				<div class="mb-2">
					<KindBadge kind={post.kind} showIcon={true} />
				</div>
			{/if}
			<a
				href="{base}/posts/{post.slug}"
				class="group/link text-text hover:text-primary block text-base font-semibold tracking-tight transition-colors sm:text-lg"
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
					class={`text-muted h-5 w-5 transition-all duration-300 ease-out ${
						open ? "text-primary rotate-180" : "group-hover:text-text rotate-0"
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
				<p class="text-text/80 mb-6 max-w-2xl text-sm leading-relaxed">{subtitle}</p>
			{/if}

			<PostMetaSidebar metadata={post} />
		</div>
	{/if}
</article>
