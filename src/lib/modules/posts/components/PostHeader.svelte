<script lang="ts">
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import { fade, fly } from "svelte/transition";
	import CloudinaryImage from "$lib/ui/CloudinaryImage.svelte";
	import { getGradientFromSeed } from "$lib/shared/gradients";

	interface Props {
		metadata: PostFrontmatter;
	}

	let { metadata }: Props = $props();

	function getKindLabel(kind: string | undefined) {
		const labels: Record<string, string> = {
			note: "Nota",
			essay: "Ensaio",
			tutorial: "Tutorial",
			thought: "Reflexão"
		};
		return labels[kind || "note"] || "Nota";
	}

	function formatDate(date: Date | string | undefined) {
		if (!date) return null;
		const d = typeof date === "string" ? new Date(date) : date;
		return d.toLocaleDateString("pt-BR", {
			day: "numeric",
			month: "long",
			year: "numeric"
		});
	}

	const fallbackGradient = $derived(getGradientFromSeed(metadata.slug));
</script>

<header
	class="relative flex min-h-[50vh] flex-col justify-end overflow-hidden rounded-2xl p-8 md:min-h-[55vh] md:p-12"
>
	<!-- Background -->
	<div class="absolute inset-0 z-0">
		{#if metadata.cover?.url}
			<CloudinaryImage
				publicId={metadata.cover.url}
				alt=""
				width={1600}
				height={900}
				priority={true}
				fill={true}
				imgClass="object-center"
			/>
		{:else}
			<div class="h-full w-full" style:background={fallbackGradient}></div>
		{/if}
		<div class="absolute inset-0 bg-linear-to-t from-black/85 via-black/60 to-transparent"></div>
	</div>

	<!-- Content -->
	<div class="relative z-10 flex max-w-4xl flex-col items-start gap-4">
		<!-- Top Meta Row -->
		<div class="flex flex-wrap items-center gap-3 text-sm" in:fade={{ duration: 400, delay: 100 }}>
			{#if metadata.kind}
				<span
					class="rounded-sm border border-white/10 bg-black/40 px-3 py-1 text-xs font-semibold tracking-[0.05em] text-white uppercase backdrop-blur-md"
					>{getKindLabel(metadata.kind)}</span
				>
			{/if}

			{#if metadata.publishedAt}
				<span class="text-white opacity-40">•</span>
				<time class="font-medium text-white/80" datetime={metadata.publishedAt.toString()}>
					{formatDate(metadata.publishedAt)}
				</time>
			{/if}
		</div>

		<!-- Title -->
		<h1
			class="font-article-title my-2 text-[clamp(2rem,5vw,3.5rem)] leading-[1.15] font-bold tracking-[-0.02em] text-balance text-white"
			in:fly={{ y: 20, duration: 600, delay: 150 }}
		>
			{metadata.title}
		</h1>

		<!-- Subtitle -->
		{#if metadata.subtitle}
			<p
				class="font-article-body my-0 max-w-[42ch] text-xl leading-[1.6] font-normal text-balance text-white/85"
				in:fly={{ y: 15, duration: 500, delay: 250 }}
			>
				{metadata.subtitle}
			</p>
		{/if}
	</div>
</header>
