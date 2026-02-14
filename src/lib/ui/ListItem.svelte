<script lang="ts">
	import { ArrowUpRight } from "@lucide/svelte";
	import type { Snippet } from "svelte";
	import CloudinaryImage from "./CloudinaryImage.svelte";
	import type { ImageMetadata } from "$lib/shared/types";
	import { cn } from "$lib/shared/merge-class";

	interface Props {
		title: string;
		href: string;
		subtitle?: string;
		cover?: ImageMetadata;
		badges?: Snippet;
		active?: boolean;
		class?: string;
	}

	let {
		title,
		href,
		subtitle,
		cover,
		badges,
		active = false,
		class: className = ""
	}: Props = $props();
</script>

<div
	class={cn(
		"relative block w-full text-left transition-all duration-300",
		!active && "group hover:bg-surface-elevated/10",
		className
	)}
>
	{#if !active}
		<a {href} class="absolute inset-0 z-20">
			<span class="sr-only">Ver {title}</span>
		</a>
	{/if}

	<div class="flex items-start gap-4 px-0 py-5 md:gap-5">
		
		{#if cover?.url}
			<div
				class="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-800 shadow-lg ring-1 ring-white/10"
			>
				<CloudinaryImage
					publicId={cover.url}
					alt={cover.alt || title}
					width={200}
					imgClass="transition-transform duration-500 group-hover:scale-105"
					fill={true}
				/>
			</div>
		{/if}

		
		<div class="relative z-10 flex min-w-0 flex-1 flex-col">
			
			{#if badges}
				<div class="flex flex-wrap items-center gap-2">
					{@render badges()}
				</div>
			{/if}

			
			<div class="relative mt-4 flex items-center gap-2">
				<h3
					class={cn(
						"font-heading my-0 text-base leading-snug font-semibold tracking-tight transition-colors duration-300 md:text-lg",
						active ? "text-primary" : "text-text group-hover:text-primary"
					)}
				>
					{title}
					{#if !active}
						<ArrowUpRight
							size={18}
							class="text-muted group-hover:text-primary mb-0.5 ml-0.5 inline opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
						/>
					{/if}
				</h3>
			</div>

			
			{#if subtitle}
				<p
					class="text-muted/70 group-hover:text-muted mt-1 font-mono text-sm tracking-normal transition-colors duration-300"
				>
					{subtitle}
				</p>
			{/if}
		</div>
	</div>
</div>
