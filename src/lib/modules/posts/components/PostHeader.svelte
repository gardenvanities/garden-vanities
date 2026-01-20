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

<header class="article-header has-cover">
	<!-- Background -->
	<div class="header-background">
		{#if hasCover && coverUrl}
			<img 
				src={coverUrl} 
				alt="" 
				class="background-image"
				loading="eager"
			/>
		{:else}
			<div class="background-gradient" style:background={fallbackGradient}></div>
		{/if}
		<div class="background-overlay"></div>
	</div>

	<!-- Content -->
	<div class="header-content">
		<!-- Top Meta Row -->
		<div class="header-meta" in:fade={{ duration: 400, delay: 100 }}>
			{#if metadata.kind}
				<span class="meta-kind">{getKindLabel(metadata.kind)}</span>
			{/if}

			{#if metadata.publishedAt}
				<span class="meta-separator">•</span>
				<time class="meta-date" datetime={metadata.publishedAt.toString()}>
					{formatDate(metadata.publishedAt)}
				</time>
			{/if}

			{#if metadata.readingTime}
				<span class="meta-separator">•</span>
				<span class="meta-reading">{metadata.readingTime} min de leitura</span>
			{/if}
		</div>

		<!-- Title -->
		<h1 class="header-title" in:fly={{ y: 20, duration: 600, delay: 150 }}>
			{metadata.title}
		</h1>

		<!-- Subtitle -->
		{#if metadata.subtitle}
			<p class="header-subtitle" in:fly={{ y: 15, duration: 500, delay: 250 }}>
				{metadata.subtitle}
			</p>
		{/if}
	</div>
</header>

<style>
	.article-header {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		border-radius: 1rem;
		overflow: hidden;
		min-height: 50vh;
		padding: 2rem;
	}

	@media (min-width: 768px) {
		.article-header {
			min-height: 55vh;
			padding: 3rem;
		}
	}

	/* Background */
	.header-background {
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	.background-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.background-gradient {
		width: 100%;
		height: 100%;
	}

	.background-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			oklch(0% 0 0 / 0.85) 0%,
			oklch(0% 0 0 / 0.6) 35%,
			oklch(0% 0 0 / 0.3) 70%,
			oklch(0% 0 0 / 0.1) 100%
		);
	}

	/* Content */
	.header-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
		max-width: 56rem;
	}

	/* Meta Row */
	.header-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		font-size: 0.875rem;
	}

	.meta-kind {
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		background: oklch(100% 0 0 / 0.15);
		color: white;
		border: 1px solid oklch(100% 0 0 / 0.2);
		backdrop-filter: blur(4px);
	}

	.meta-separator {
		color: white;
		opacity: 0.4;
	}

	.meta-date,
	.meta-reading {
		color: oklch(100% 0 0 / 0.8);
		font-weight: 450;
	}

	/* Title */
	.header-title {
		font-family: var(--font-article-title);
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: -0.02em;
		color: white;
		margin: 0.5rem 0 0 0;
		text-wrap: balance;
		text-shadow: 0 2px 20px oklch(0% 0 0 / 0.3);
	}

	/* Subtitle */
	.header-subtitle {
		font-family: var(--font-article-body);
		font-size: 1.25rem;
		line-height: 1.6;
		color: oklch(100% 0 0 / 0.85);
		font-weight: 400;
		margin: 0;
		text-wrap: balance;
		max-width: 42ch;
		text-shadow: 0 1px 10px oklch(0% 0 0 / 0.2);
	}
</style>
