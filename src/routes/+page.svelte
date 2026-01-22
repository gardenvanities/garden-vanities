<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import Grid from "$lib/layout/Grid.svelte";
	import SectionHeader from "$lib/modules/garden/components/SectionHeader.svelte";
	import SetCard from "$lib/modules/garden/components/SetCard.svelte";
	import Hero from "./_components/Hero.svelte";
	import CloudinaryImage from "$lib/ui/CloudinaryImage.svelte";
	import { fly } from "svelte/transition";
	import { buildCloudinaryUrl } from "$lib/shared/cloudinary";

	import { Layers } from "@lucide/svelte";

	interface SeriesItem {
		slug: string;
		title: string;
		description?: string;
		cover?: { url: string; alt?: string };
		status: string;
		postCount: number;
		lastUpdated: string;
	}

	interface SetItem {
		slug: string;
		title: string;
		description?: string;
		cover?: { url: string; alt?: string };
		count: number;
		href: string;
	}

	interface Props {
		data: {
			sets: SetItem[];
			series: SeriesItem[];
		};
	}

	let { data }: Props = $props();

	function getStatusLabel(status: string) {
		const labels: Record<string, string> = {
			ongoing: "Em andamento",
			completed: "Completa",
			archived: "Arquivada"
		};
		return labels[status] || labels.ongoing;
	}
</script>

<SEO title="Garden of Vanities" type="website" />

<Hero />

<Section id="content" class="py-12">
	<Container size="lg">
		<div in:fly={{ y: 30, duration: 800, delay: 400 }}>
			{#if data.sets.length > 0}
				<div class="space-y-8">
					<div class="flex items-center justify-between">
						<SectionHeader title="Coleções" count={data.sets.length} />
						<a
							href="/sets"
							class="text-muted hover:text-primary hidden text-sm font-medium transition-colors md:block"
						>
							Ver todas as coleções →
						</a>
					</div>

					<Grid cols={3} gap="md">
						{#each data.sets.slice(0, 3) as set (set.slug)}
							<SetCard {set} class="h-96" />
						{/each}
					</Grid>

					<div class="mt-6 flex justify-center md:hidden">
						<a
							href="/sets"
							class="text-muted hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors"
						>
							Ver todas as coleções
							<span aria-hidden="true">→</span>
						</a>
					</div>
				</div>
			{/if}

			{#if data.series && data.series.length > 0}
				<div class="mt-12 space-y-8" in:fly={{ y: 20, duration: 800, delay: 100 }}>
					<div class="flex items-center justify-between">
						<SectionHeader title="Séries" count={data.series.length} />
						<a
							href="/series"
							class="text-muted hover:text-primary hidden text-sm font-medium transition-colors md:block"
						>
							Ver todas as séries →
						</a>
					</div>

					<Grid cols={3} gap="md">
						{#each data.series.slice(0, 3) as serie (serie.slug)}
							{@const statusInfo = getStatusLabel(serie.status)}
							<a
								href="/series/{serie.slug}"
								class="group relative block h-[400px] overflow-hidden rounded-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
							>
								<!-- Background Image -->
								{#if serie.cover?.url}
									<CloudinaryImage
										publicId={serie.cover.url}
										alt={serie.cover.alt || serie.title}
										fill={true}
										imgClass="transition-transform duration-500 group-hover:scale-105"
										width={800}
										height={600}
									/>
								{:else}
									<!-- Fallback gradient background -->
									<div
										class="bg-primary/10 from-primary/20 to-primary/5 absolute inset-0 bg-linear-to-br"
									></div>
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
									class="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end gap-2 bg-black/60 p-5 pt-24 backdrop-blur-xl transition-all duration-300"
									style="mask-image: linear-gradient(to bottom, transparent 0%, black 50%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 50%);"
								>
									<!-- Title -->
									<h3 class="font-heading text-xl leading-tight font-bold text-white">
										{serie.title}
									</h3>

									<!-- Description -->
									{#if serie.description}
										<p class="line-clamp-2 font-mono text-sm text-white/80">
											{serie.description}
										</p>
									{/if}
								</div>
							</a>
						{/each}
					</Grid>

					<div class="mt-6 flex justify-center md:hidden">
						<a
							href="/series"
							class="text-muted hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors"
						>
							Ver todas as séries
							<span aria-hidden="true">→</span>
						</a>
					</div>
				</div>
			{/if}
		</div>
	</Container>
</Section>
