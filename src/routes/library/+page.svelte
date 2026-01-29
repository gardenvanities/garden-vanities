<script lang="ts">
	import { Container } from "$lib/layout";
	import {
		ResourceCard,
		ResourceStats,
		ResourceFilter,
		TypeIcon,
		TYPE_LABELS_PLURAL,
		type ResourceType,
		type ConsumptionStatus
	} from "$lib/modules/library";
	import { ChevronRight, Library, Sparkles } from "@lucide/svelte";

	let { data } = $props();

	// Filter state
	let selectedTypes = $state<ResourceType[]>([]);
	let selectedStatus = $state<ConsumptionStatus[]>([]);
	let searchQuery = $state("");

	// Get available types from stats
	const availableTypes = $derived(
		(Object.entries(data.stats.byType) as [ResourceType, number][])
			.filter(([, count]) => count > 0)
			.map(([type]) => type)
	);

	// Filter resources
	const filteredResources = $derived(() => {
		return data.resources.filter((resource) => {
			// Type filter
			if (selectedTypes.length > 0 && !selectedTypes.includes(resource.type)) {
				return false;
			}

			// Status filter
			if (selectedStatus.length > 0 && !selectedStatus.includes(resource.status)) {
				return false;
			}

			// Search filter
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				const titleMatch = resource.title.toLowerCase().includes(query);
				const summaryMatch = resource.summary?.toLowerCase().includes(query);
				if (!titleMatch && !summaryMatch) {
					return false;
				}
			}

			return true;
		});
	});

	// Group filtered resources by type
	const filteredByType = $derived(() => {
		const result: Record<ResourceType, typeof data.resources> = {} as Record<
			ResourceType,
			typeof data.resources
		>;
		for (const resource of filteredResources()) {
			if (!result[resource.type]) {
				result[resource.type] = [];
			}
			result[resource.type].push(resource);
		}
		return result;
	});

	// Check if we have any filters active
	const hasFilters = $derived(
		selectedTypes.length > 0 || selectedStatus.length > 0 || searchQuery.length > 0
	);

	function getTypeHref(type: ResourceType): string {
		const folderMap: Record<ResourceType, string> = {
			book: "books",
			film: "films",
			"tv-series": "series-tv",
			album: "music",
			track: "music",
			playlist: "music",
			article: "articles",
			paper: "research"
		};
		return `/library/${folderMap[type]}`;
	}
</script>

<svelte:head>
	<title>Biblioteca | Garden of Vanities</title>
	<meta
		name="description"
		content="Minha biblioteca pessoal de livros, filmes, músicas, artigos e pesquisas que inspiram e fundamentam meu trabalho."
	/>
</svelte:head>

<Container class="py-12 md:py-20">
	<!-- Header -->
	<header class="mb-16 text-center">
		<div
			class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/6 bg-white/2 px-4 py-2 text-sm text-white/50"
		>
			<Library class="h-4 w-4" />
			<span>Biblioteca</span>
		</div>
		<h1
			class="font-heading mx-auto max-w-3xl text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl"
		>
			Consumo <span class="text-brand-400">Consciente</span> de Conteúdo
		</h1>
		<p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
			Livros, filmes, músicas, artigos e pesquisas que inspiram e fundamentam meu trabalho. Cada
			item aqui é uma peça do mosaico que forma minhas ideias.
		</p>
	</header>

	<!-- Stats -->
	<section class="mb-16">
		<ResourceStats stats={data.stats} />
	</section>

	<!-- Currently Consuming -->
	{#if data.currentlyConsuming.length > 0 && !hasFilters}
		<section class="mb-16">
			<div class="mb-8 flex items-center gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20"
				>
					<Sparkles class="h-5 w-5 text-blue-400" />
				</div>
				<div>
					<h2 class="font-heading text-2xl font-medium text-white">Consumindo Agora</h2>
					<p class="text-sm text-white/40">O que estou lendo, assistindo e ouvindo no momento</p>
				</div>
			</div>

			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.currentlyConsuming.slice(0, 3) as resource (resource.slug)}
					<ResourceCard {resource} variant="horizontal" showType={true} />
				{/each}
			</div>
		</section>
	{/if}

	<!-- Filters -->
	<section class="mb-10">
		<ResourceFilter
			{selectedTypes}
			{selectedStatus}
			{searchQuery}
			{availableTypes}
			onTypeChange={(types) => (selectedTypes = types)}
			onStatusChange={(status) => (selectedStatus = status)}
			onSearchChange={(query) => (searchQuery = query)}
		/>
	</section>

	<!-- Resources by Type -->
	{#if hasFilters}
		<!-- Filtered view: flat grid -->
		<section>
			{#if filteredResources().length === 0}
				<div class="flex flex-col items-center justify-center py-20 text-center">
					<div
						class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-800/30 ring-1 ring-white/5"
					>
						<Library class="h-10 w-10 text-neutral-600" />
					</div>
					<h3 class="text-xl font-medium text-white">Nenhum recurso encontrado</h3>
					<p class="mt-2 max-w-sm text-white/40">
						Tente ajustar os filtros ou use termos de busca diferentes
					</p>
					<button
						onclick={() => {
							selectedTypes = [];
							selectedStatus = [];
							searchQuery = "";
						}}
						class="mt-6 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
					>
						Limpar filtros
					</button>
				</div>
			{:else}
				<div class="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{#each filteredResources() as resource (resource.slug)}
						<ResourceCard {resource} />
					{/each}
				</div>
			{/if}
		</section>
	{:else}
		<!-- Default view: grouped by type -->
		<div class="space-y-16">
			{#each Object.entries(filteredByType()) as [type, resources] (type)}
				<section>
					<div class="mb-6 flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div
								class="flex h-9 w-9 items-center justify-center rounded-lg bg-white/4 ring-1 ring-white/10"
							>
								<TypeIcon type={type as ResourceType} class="h-4 w-4 text-white/50" />
							</div>
							<div>
								<h2 class="font-heading text-xl font-medium text-white">
									{TYPE_LABELS_PLURAL[type as ResourceType]}
								</h2>
							</div>
							<span
								class="rounded-full bg-white/6 px-2.5 py-0.5 text-sm text-white/40 tabular-nums"
							>
								{resources.length}
							</span>
						</div>
						{#if resources.length > 4}
							<a
								href={getTypeHref(type as ResourceType)}
								class="group hover:border-brand-500/30 hover:bg-brand-500/5 hover:text-brand-400 flex items-center gap-1.5 rounded-lg border border-white/6 bg-white/2 px-3 py-1.5 text-sm text-white/50 transition-all"
							>
								Ver todos
								<ChevronRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
							</a>
						{/if}
					</div>

					<div class="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
						{#each resources.slice(0, 5) as resource (resource.slug)}
							<ResourceCard {resource} showType={false} />
						{/each}
					</div>
				</section>
			{/each}
		</div>
	{/if}
</Container>
