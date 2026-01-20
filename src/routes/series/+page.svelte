<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import Grid from "$lib/layout/Grid.svelte";
	import { Layers } from "@lucide/svelte";
	import { fly, fade } from "svelte/transition";
	import { buildCloudinaryUrl } from "$lib/shared/cloudinary";

	let { data } = $props();

	function getStatusLabel(status: string) {
		const labels: Record<string, string> = {
			ongoing: "Em andamento",
			completed: "Completa",
			archived: "Arquivada"
		};
		return labels[status] || labels.ongoing;
	}
</script>

<SEO
	title="Séries | Garden of Vanities"
	description="Coleções de notas e ensaios organizados em sequência."
/>

<Section class="py-16 md:py-24">
	<Container size="lg">
		<div in:fly={{ y: 20, duration: 800 }}>
			<!-- Premium Page Header -->
			<header class="page-header mb-16 md:mb-20">
				<div class="header-content">
					<div class="header-icon" in:fade={{ duration: 600, delay: 200 }}>
						<Layers size={20} strokeWidth={1.5} />
					</div>
					<h1 class="header-title" in:fly={{ y: 15, duration: 700, delay: 100 }}>
						Séries
					</h1>
					<div class="header-line" in:fade={{ duration: 800, delay: 300 }}></div>
					<p class="header-subtitle" in:fly={{ y: 10, duration: 600, delay: 250 }}>
						Trilhas de conhecimento para ler em ordem
					</p>
				</div>
			</header>

			<Grid cols={3} gap="lg">
			{#each data.series as serie, i (serie.slug)}
				{@const statusInfo = getStatusLabel(serie.status)}
				<a
					href="/series/{serie.slug}"
					in:fly={{ y: 20, duration: 800, delay: i * 100 }}
					class="group relative block h-[400px] overflow-hidden rounded-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
				>
					<!-- Background Image -->
					{#if serie.cover?.url}
						<img
							src={buildCloudinaryUrl(serie.cover.url, { width: 800, height: 600, crop: "fill" })}
							alt={serie.cover.alt || serie.title}
							class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					{:else}
						<!-- Fallback gradient background -->
						<div class="bg-primary/10 absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5"></div>
					{/if}

					<!-- Layers Icon - Top Left (Series Identifier) -->
					<div class="absolute top-4 left-4 z-20">
						<div
							class="flex items-center justify-center rounded-sm border border-white/10 bg-black/40 p-2 backdrop-blur-md transition-all duration-300 group-hover:border-white/20 group-hover:bg-black/50"
						>
							<Layers size={16} class="text-white/90" />
						</div>
					</div>

					<!-- Badges - Top Right -->
					<div class="absolute top-4 right-4 z-20 flex items-center gap-2">
						<!-- Post Count Tag -->
						<span
							class="flex items-center gap-1.5 rounded-sm border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md transition-all duration-300 group-hover:border-white/20 group-hover:bg-black/50"
						>
							{serie.postCount}
							{serie.postCount === 1 ? "parte" : "partes"}
						</span>

						<!-- Status Tag -->
						<span
							class="rounded-sm border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md transition-all duration-300 group-hover:border-white/20 group-hover:bg-black/50"
						>
							{statusInfo}
						</span>
					</div>

					<!-- Gradient Overlay -->
					<div
						class="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end gap-3 bg-linear-to-t from-black/90 via-black/60 to-transparent p-6 pb-6 pt-24 transition-all duration-300"
					>
						<!-- Title -->
						<h3 class="font-heading text-2xl font-bold leading-tight text-white">
							{serie.title}
						</h3>

						<!-- Description -->
						{#if serie.description}
							<p class="line-clamp-2 text-sm text-white/80">
								{serie.description}
							</p>
						{/if}
					</div>
				</a>
			{/each}
		</Grid>
		</div>
	</Container>
</Section>

<style>
	.page-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.header-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.header-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background: oklch(from var(--color-primary) l c h / 0.08);
		color: var(--color-primary);
		margin-bottom: 0.5rem;
	}

	.header-title {
		font-family: var(--font-heading);
		font-size: clamp(2.5rem, 6vw, 4rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.1;
		color: var(--color-text);
		margin: 0;
	}

	.header-line {
		width: 4rem;
		height: 2px;
		background: linear-gradient(
			90deg,
			transparent,
			oklch(from var(--color-primary) l c h / 0.5),
			transparent
		);
		margin: 0.5rem 0;
	}

	.header-subtitle {
		font-size: 1.125rem;
		color: var(--color-muted);
		font-weight: 400;
		letter-spacing: 0.01em;
		max-width: 32ch;
		margin: 0;
	}
</style>
