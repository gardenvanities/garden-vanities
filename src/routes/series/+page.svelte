<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import Grid from "$lib/layout/Grid.svelte";
	import SeriesCard from "$lib/modules/garden/components/SeriesCard.svelte";
	import PageHeader from "$lib/ui/PageHeader.svelte";
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
			<!-- Premium Page Header -->
			<PageHeader 
				title="Séries" 
				description="Trilhas de conhecimento para ler em ordem" 
			/>

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
