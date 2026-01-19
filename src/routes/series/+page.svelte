<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import Grid from "$lib/layout/Grid.svelte";
	import { Library, ArrowRight, Clock, BookOpen } from "@lucide/svelte";
	import { fly } from "svelte/transition";
	import { formatRelativeDate } from "$lib/modules/posts/utils/date";

	let { data } = $props();

	function getStatusLabel(status: string) {
		const labels: Record<string, { text: string; class: string }> = {
			ongoing: { text: "Em andamento", class: "bg-primary/15 text-primary" },
			completed: { text: "Completa", class: "bg-green-500/15 text-green-600" },
			archived: { text: "Arquivada", class: "bg-muted/30 text-muted" }
		};
		return labels[status] || labels.ongoing;
	}
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
					{@const statusInfo = getStatusLabel(serie.status)}
					<a
						href="/series/{serie.slug}"
						in:fly={{ y: 20, duration: 800, delay: i * 100 }}
						class="bg-surface group border-border hover:border-border-vivid relative flex flex-col gap-4 rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
					>
						<!-- Header with icon and status badge -->
						<div class="flex items-start justify-between">
							<div
								class="bg-primary/5 text-primary flex h-12 w-12 items-center justify-center rounded-lg"
							>
								<Library size={24} />
							</div>
							<span class="rounded-full px-2.5 py-1 text-xs font-medium {statusInfo.class}">
								{statusInfo.text}
							</span>
						</div>

						<!-- Title and description -->
						<div class="flex-1">
							<h3
								class="font-heading text-text group-hover:text-primary text-2xl leading-tight font-bold transition-colors"
							>
								{serie.title}
							</h3>
							{#if serie.description}
								<p class="text-muted mt-2 line-clamp-2 text-sm">
									{serie.description}
								</p>
							{/if}
						</div>

						<!-- Stats -->
						<div class="text-muted flex items-center gap-4 text-xs font-medium">
							<span class="flex items-center gap-1">
								<BookOpen size={14} />
								{serie.postCount}
								{serie.postCount === 1 ? "parte" : "partes"}
							</span>
							{#if serie.lastUpdated}
								<span class="flex items-center gap-1">
									<Clock size={14} />
									{formatRelativeDate(serie.lastUpdated)}
								</span>
							{/if}
						</div>

						<!-- Arrow indicator -->
						<div class="text-muted mt-auto flex items-center justify-end pt-2">
							<ArrowRight
								size={16}
								class="text-muted group-hover:text-primary transition-transform group-hover:translate-x-1"
							/>
						</div>
					</a>
				{/each}
			</Grid>
		</div>
	</Container>
</Section>
