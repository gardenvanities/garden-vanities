<script lang="ts">
	import { Container, Grid } from "$lib/layout";
	import { ResourceCard, TypeIcon } from "$lib/modules/library";
	import { ChevronLeft, Library } from "@lucide/svelte";

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.typeLabel} | Biblioteca | Garden of Vanities</title>
	<meta name="description" content="Explore minha coleção de {data.typeLabel.toLowerCase()}." />
</svelte:head>

<Container class="py-12 md:py-16">
	
	<nav class="mb-8">
		<a
			href="/library"
			class="text-muted hover:text-primary inline-flex items-center gap-1 text-sm transition-colors"
		>
			<ChevronLeft class="h-4 w-4" />
			Biblioteca
		</a>
	</nav>

	
	<header class="mb-12">
		<div class="flex items-center gap-3">
			<TypeIcon type={data.resourceType} class="text-primary h-8 w-8" />
			<h1 class="font-heading text-text text-4xl font-bold md:text-5xl">
				{data.typeLabel}
			</h1>
			<span class="bg-surface-elevated text-muted rounded-full px-3 py-1 text-lg">
				{data.resources.length}
			</span>
		</div>
	</header>

	
	

	
	<section>
		<section>
			{#if data.resources.length === 0}
				<div class="flex flex-col items-center justify-center py-16 text-center">
					<div
						class="bg-surface-elevated mb-4 flex h-16 w-16 items-center justify-center rounded-full"
					>
						<Library class="text-muted h-8 w-8" />
					</div>
					<p class="text-muted text-lg">Nenhum recurso encontrado</p>
				</div>
			{:else}
				<Grid cols={3} gap="lg">
					{#each data.resources as resource (resource.slug)}
						<div>
							<ResourceCard {resource} showType={false} />
						</div>
					{/each}
				</Grid>
			{/if}
		</section>
	</section>
</Container>
