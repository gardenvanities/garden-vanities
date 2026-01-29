<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import Grid from "$lib/layout/Grid.svelte";
	import SetCard from "$lib/modules/garden/components/SetCard.svelte";
	import PageHeader from "$lib/ui/PageHeader.svelte";
	import { fly } from "svelte/transition";

	let { data } = $props();
</script>

<SEO
	title="Sets (Atlas) | Garden of Vanities"
	description="Mapa de todos os sets e áreas de interesse do jardim."
/>

<Section class="py-16 md:py-24">
	<Container size="lg">
		<div in:fly={{ y: 20, duration: 800 }}>
			<!-- Premium Page Header -->
			<!-- Premium Page Header -->
			<!-- Premium Page Header -->
			<PageHeader title="Coleções" description="Áreas de interesse agrupadas por tema" />

			<Grid cols={3} gap="lg">
				{#each data.sets as set, i (set.slug)}
					<div in:fly={{ y: 20, duration: 800, delay: i * 50 }}>
						<SetCard {set} class="h-96" />
					</div>
				{/each}
			</Grid>
		</div>
	</Container>
</Section>
