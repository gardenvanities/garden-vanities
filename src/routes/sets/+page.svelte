<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import Grid from "$lib/layout/Grid.svelte";
	import SetCard from "$lib/modules/garden/components/SetCard.svelte";
	import { fly } from "svelte/transition";

	let { data } = $props();
</script>

<SEO
	title="Sets (Atlas) | Garden of Vanities"
	description="Mapa de todos os sets e áreas de interesse do jardim."
/>

<Section class="py-12">
	<Container size="lg">
		<div in:fly={{ y: 20, duration: 800 }}>
			<div class="mb-12 text-center">
				<h1 class="font-heading text-text mb-4 text-5xl font-bold">Atlas do Jardim</h1>
				<p class="text-muted text-xl">Navegue por todas as áreas de interesse cultivadas.</p>
			</div>

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
