<script lang="ts">
	import SEO from "$lib/components/core/SEO.svelte";
	import Container from "$lib/components/layout/Container.svelte";
	import Section from "$lib/components/layout/Section.svelte";
	import Grid from "$lib/components/layout/Grid.svelte";
	import { Library, ArrowRight } from "@lucide/svelte";
	import { fly } from "svelte/transition";
	import { formatRelativeDate } from "$lib/utils/date";

	let { data } = $props();
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
					<a
						href="/series/{serie.slug}"
						in:fly={{ y: 20, duration: 800, delay: i * 100 }}
						class="bg-surface group border-border hover:border-border-vivid relative flex flex-col gap-4 rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
					>
						<div
							class="bg-primary/5 text-primary mb-2 flex h-12 w-12 items-center justify-center rounded-lg"
						>
							<Library size={24} />
						</div>

						<div>
							<h3
								class="font-heading text-text group-hover:text-primary text-2xl leading-tight font-bold transition-colors"
							>
								{serie.name}
							</h3>
							<p class="text-muted mt-2 text-sm">
								{serie.count}
								{serie.count === 1 ? "parte" : "partes"}
							</p>
						</div>

						<div
							class="text-muted mt-auto flex items-center justify-between pt-4 text-xs font-medium"
						>
							<span>Atualizado {formatRelativeDate(serie.lastUpdated)}</span>
							<ArrowRight size={16} class="text-muted group-hover:text-primary transition-colors" />
						</div>
					</a>
				{/each}
			</Grid>
		</div>
	</Container>
</Section>
