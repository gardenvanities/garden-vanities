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
	<!-- Breadcrumb -->
	<nav class="mb-8">
		<a
			href="/library"
			class="hover:text-brand-400 inline-flex items-center gap-1 text-sm text-white/50 transition-colors"
		>
			<ChevronLeft class="h-4 w-4" />
			Biblioteca
		</a>
	</nav>

	<!-- Header -->
	<header class="mb-12">
		<div class="flex items-center gap-3">
			<TypeIcon type={data.resourceType} class="text-brand-400 h-8 w-8" />
			<h1 class="font-heading text-4xl font-bold text-white md:text-5xl">
				{data.typeLabel}
			</h1>
			<span class="rounded-full bg-white/10 px-3 py-1 text-lg text-white/50">
				{data.resources.length}
			</span>
		</div>
	</header>

	<!-- Search & Filters -->
	<!-- Search section removed -->

	<!-- Resources Grid -->
	<section>
		<section>
			{#if data.resources.length === 0}
				<div class="flex flex-col items-center justify-center py-16 text-center">
					<div
						class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800/50"
					>
						<Library class="h-8 w-8 text-neutral-500" />
					</div>
					<p class="text-lg text-white/60">Nenhum recurso encontrado</p>
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
