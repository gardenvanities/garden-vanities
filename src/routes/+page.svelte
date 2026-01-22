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

	import SeriesCard from "$lib/modules/garden/components/SeriesCard.svelte";

	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
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
							<SeriesCard {serie} />
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
