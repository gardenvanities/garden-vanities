<script lang="ts">
	import { Container, Grid } from "$lib/layout";
	import { ResourceCard } from "$lib/modules/library";
	import PageHeader from "$lib/ui/PageHeader.svelte";
	import SEO from "$lib/core/seo/SEO.svelte";

	let { data } = $props();
</script>

<SEO
	title="Biblioteca"
	description="Minha biblioteca pessoal de livros, filmes, músicas, artigos e pesquisas que inspiram e fundamentam meu trabalho."
/>


<Container class="py-12 md:py-20">
	<PageHeader
		title="Biblioteca"
		description="Livros, filmes, músicas, artigos e pesquisas que inspiram e fundamentam meu trabalho."
	/>

	
	

	
	<section>
		<section>
			{#if data.resources.length > 0}
				<Grid cols={3} gap="lg">
					{#each data.resources as resource (resource.slug)}
						<div>
							<ResourceCard {resource} />
						</div>
					{/each}
				</Grid>
			{/if}
		</section>
	</section>
</Container>
