<script lang="ts">
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import { buildCloudinaryUrl } from "$lib/shared/cloudinary";
	import { fade, fly } from "svelte/transition";

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

	// Pastel gradient palettes - each has 2-3 colors for smooth gradients
	const pastelGradients = [
		["oklch(85% 0.08 280)", "oklch(90% 0.06 320)", "oklch(88% 0.07 350)"], // lavender-pink
		["oklch(88% 0.07 200)", "oklch(85% 0.08 230)", "oklch(90% 0.05 180)"], // mint-cyan
		["oklch(90% 0.06 60)", "oklch(88% 0.08 30)", "oklch(85% 0.07 80)"],    // peach-coral
		["oklch(87% 0.07 140)", "oklch(90% 0.05 170)", "oklch(85% 0.06 120)"], // sage-green
		["oklch(88% 0.06 250)", "oklch(85% 0.08 290)", "oklch(90% 0.05 210)"], // sky-blue
		["oklch(90% 0.07 340)", "oklch(87% 0.06 10)", "oklch(88% 0.08 320)"],  // rose-blush
		["oklch(86% 0.08 90)", "oklch(90% 0.05 120)", "oklch(88% 0.06 60)"],   // lime-yellow
		["oklch(89% 0.05 300)", "oklch(85% 0.07 260)", "oklch(87% 0.06 330)"], // violet-purple
	];

	// Generate a consistent gradient based on the slug (so it's the same on each load)
	function getGradientFromSlug(slug: string): string {
		let hash = 0;
		for (let i = 0; i < slug.length; i++) {
			const char = slug.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash;
		}
		const index = Math.abs(hash) % pastelGradients.length;
		const colors = pastelGradients[index];
		const angle = (Math.abs(hash) % 360);
		return `linear-gradient(${angle}deg, ${colors.join(", ")})`;
	}

	const hasCover = $derived(!!metadata.cover?.url);
	const coverUrl = $derived(
		metadata.cover?.url 
			? buildCloudinaryUrl(metadata.cover.url, { width: 1600, height: 900, crop: "fill" })
			: null
	);
	const fallbackGradient = $derived(getGradientFromSlug(metadata.slug));
</script>

<header
	class="relative flex min-h-[50vh] flex-col justify-end overflow-hidden rounded-2xl p-8 md:min-h-[55vh] md:p-12"
>
	<!-- Background -->
	<div class="absolute inset-0 z-0">
		{#if hasCover && coverUrl}
			<img src={coverUrl} alt="" class="h-full w-full object-cover object-center" loading="eager" />
		{:else}
			<div class="h-full w-full" style:background={fallbackGradient}></div>
		{/if}
		<div
			class="absolute inset-0 bg-linear-to-t from-black/85 via-black/60 to-transparent"
		></div>
	</div>

	<!-- Content -->
	<div class="relative z-10 flex max-w-4xl flex-col items-start gap-4">
		<!-- Top Meta Row -->
		<div
			class="flex flex-wrap items-center gap-3 text-sm"
			in:fade={{ duration: 400, delay: 100 }}
		>
			{#if metadata.kind}
				<span
					class="bg-white/15 border-white/20 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.05em] text-white backdrop-blur-sm"
					>{getKindLabel(metadata.kind)}</span
				>
			{/if}

			{#if metadata.publishedAt}
				<span class="text-white opacity-40">•</span>
				<time
					class="font-medium text-white/80"
					datetime={metadata.publishedAt.toString()}
				>
					{formatDate(metadata.publishedAt)}
				</time>
			{/if}
		</div>

		<!-- Title -->
		<h1
			class="font-article-title text-shadow-lg my-2 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-white text-balance"
			in:fly={{ y: 20, duration: 600, delay: 150 }}
		>
			{metadata.title}
		</h1>

		<!-- Subtitle -->
		{#if metadata.subtitle}
			<p
				class="font-article-body text-shadow-sm my-0 max-w-[42ch] text-xl font-normal leading-[1.6] text-white/85 text-balance"
				in:fly={{ y: 15, duration: 500, delay: 250 }}
			>
				{metadata.subtitle}
			</p>
		{/if}
	</div>
</header>


