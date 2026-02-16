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
		"group relative block aspect-3/4 w-full overflow-hidden rounded-sm transition-all duration-300 select-none hover:-translate-y-1 hover:shadow-lg",
		className
	)}
>
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
		<div class="bg-primary/10 from-primary/20 to-primary/5 absolute inset-0 bg-linear-to-br">
			<div
				class="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,var(--color-text)_1px,transparent_0)] bg-size-[24px_24px] opacity-5"
			></div>
		</div>
	{/if}

	{#if icon}
		<div class="absolute top-4 left-4 z-20">
			<div
				class="bg-surface/75 border-border/60 text-text group-hover:border-border-vivid group-hover:bg-surface-elevated/85 flex items-center justify-center rounded-sm border p-2 backdrop-blur-md transition-all duration-300"
			>
				{@render icon()}
			</div>
		</div>
	{/if}

	{#if badges}
		<div class="absolute top-4 right-4 z-20 flex items-center gap-2">
			{@render badges()}
		</div>
	{/if}

	<div
		class="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end gap-2 p-5 pt-24 backdrop-blur-xl transition-all duration-300"
		style="background: linear-gradient(to top, oklch(from var(--color-bg) l c h / 0.9) 0%, oklch(from var(--color-bg) l c h / 0.62) 58%, transparent 100%);"
	>
		<h3 class="font-heading text-text text-xl leading-tight font-bold">
			{title}
		</h3>

		{#if description}
			<p class="text-muted line-clamp-2 font-mono text-sm">
				{description}
			</p>
		{/if}
	</div>
</a>
