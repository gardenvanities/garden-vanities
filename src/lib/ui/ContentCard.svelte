<script lang="ts">
	import { cn } from "$lib/shared/merge-class";
	import CloudinaryImage from "$lib/ui/CloudinaryImage.svelte";
	import type { Snippet } from "svelte";

	interface Props {
		title: string;
		description?: string;
		href: string;
		cover?: { url: string; alt?: string };
		icon?: Snippet;
		badges?: Snippet;
		class?: string;
	}

	let { title, description, href, cover, icon, badges, class: className = "" }: Props = $props();
</script>

<a
	{href}
	class={cn(
		"group relative block aspect-3/4 w-full overflow-hidden rounded-sm transition-all duration-300 select-none hover:-translate-y-1 hover:shadow-xl",
		className
	)}
>
	<!-- Background Image -->
	{#if cover?.url}
		<CloudinaryImage
			publicId={cover.url}
			alt={cover.alt || title}
			fill={true}
			imgClass="transition-transform duration-500 group-hover:scale-105"
			width={800}
			height={600}
		/>
	{:else}
		<!-- Fallback gradient background -->
		<div class="bg-primary/10 from-primary/20 to-primary/5 absolute inset-0 bg-linear-to-br">
			<!-- Fallback Texture -->
			<div
				class="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,var(--color-text)_1px,transparent_0)] bg-size-[24px_24px] opacity-5"
			></div>
		</div>
	{/if}

	<!-- Icon Identifier - Top Left -->
	{#if icon}
		<div class="absolute top-4 left-4 z-20">
			<div
				class="flex items-center justify-center rounded-sm border border-white/10 bg-black/40 p-2 backdrop-blur-md transition-all duration-300 group-hover:border-white/20 group-hover:bg-black/50"
			>
				{@render icon()}
			</div>
		</div>
	{/if}

	<!-- Badges - Top Right -->
	{#if badges}
		<div class="absolute top-4 right-4 z-20 flex items-center gap-2">
			{@render badges()}
		</div>
	{/if}

	<!-- Gradient Overlay (Glass Effect) -->
	<div
		class="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end gap-2 bg-black/60 p-5 pt-24 backdrop-blur-xl transition-all duration-300"
		style="mask-image: linear-gradient(to bottom, transparent 0%, black 50%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 50%);"
	>
		<!-- Title -->
		<h3 class="font-heading text-xl leading-tight font-bold text-white">
			{title}
		</h3>

		<!-- Description -->
		{#if description}
			<p class="line-clamp-2 font-mono text-sm text-white/80">
				{description}
			</p>
		{/if}
	</div>
</a>
