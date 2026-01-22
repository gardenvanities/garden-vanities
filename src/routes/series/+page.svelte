<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import Grid from "$lib/layout/Grid.svelte";
	import SeriesCard from "$lib/modules/garden/components/SeriesCard.svelte";
	import { Layers } from "@lucide/svelte";
	import { fly, fade } from "svelte/transition";
	import CloudinaryImage from "$lib/ui/CloudinaryImage.svelte";

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
			<!-- Premium Page Header -->
			<header class="mb-16 flex flex-col items-center text-center md:mb-20">
				<div class="flex flex-col items-center gap-4">
					<h1
						class="font-heading text-text my-0 text-[clamp(2.5rem,6vw,4rem)] leading-[1.1] font-bold tracking-[-0.02em]"
						in:fly={{ y: 15, duration: 700, delay: 100 }}
					>
						Séries
					</h1>
					<p
						class="text-muted my-0 max-w-[32ch] text-lg font-normal tracking-[0.01em]"
						in:fly={{ y: 10, duration: 600, delay: 250 }}
					>
						Trilhas de conhecimento para ler em ordem
					</p>
				</div>
			</header>

			<Grid cols={3} gap="lg">
				{#each data.series as serie, i (serie.slug)}
					<div in:fly={{ y: 20, duration: 800, delay: i * 100 }}>
						<SeriesCard {serie} />
					</div>
				{/each}
			</Grid>
		</div>
	</Container>
</Section>
