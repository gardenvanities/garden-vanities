<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import Grid from "$lib/layout/Grid.svelte";
	import { Layers } from "@lucide/svelte";
	import { fly } from "svelte/transition";
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

<Section class="py-12">
	<Container size="lg">
		<div in:fly={{ y: 20, duration: 800 }}>
			<div class="mb-12 text-center">
				<h1 class="font-heading text-text mb-4 text-5xl font-bold">Séries & Coleções</h1>
				<p class="text-muted text-xl">Trilhas de conhecimento para ler em ordem.</p>
			</div>

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
