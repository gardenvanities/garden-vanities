<script lang="ts">
	import { replaceState } from "$app/navigation";
	import { page } from "$app/state";
	import { Loader2 } from "@lucide/svelte";
	import { onMount } from "svelte";

	import viewport from "$lib/actions/viewport";
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import { DEFAULT_EXPLORE_FILTERS } from "$lib/modules/explore/constants";
	import ExploreToolbar from "$lib/modules/explore/components/ExploreToolbar.svelte";
	import {
		buildExploreItems,
		buildTagOptions,
		createPostSearchEntry,
		createSeriesSearchEntry,
		createSetSearchEntry,
		filterPostEntries,
		filterSeriesEntries,
		filterSetEntries,
		getStandalonePosts
	} from "$lib/modules/explore/filtering";
	import {
		buildExploreFiltersFromSearchParams,
		buildExploreSearchParams
	} from "$lib/modules/explore/services";
	import SeriesCard from "$lib/modules/garden/components/SeriesCard.svelte";
	import SetCard from "$lib/modules/garden/components/SetCard.svelte";
	import PostMasonryCard from "$lib/modules/posts/components/PostMasonryCard.svelte";
	import { scrollState } from "$lib/stores/scroll.svelte";
	import { ui } from "$lib/stores/ui.svelte";
	import type {
		ExploreFilters,
		ExploreSeriesItem,
		ExploreSetItem
	} from "$lib/modules/explore/types";

	let { data } = $props();

	const EXPLORE_HEADER_HEIGHT = 52;

	let filters = $state<ExploreFilters>({ ...DEFAULT_EXPLORE_FILTERS });
	let searchDraft = $state("");
	let visibleCount = $state(10);
	let hydrated = $state(false);

	let isSidebarExpanded = $derived(ui.sidebarExpanded);

	let seriesItems = $derived(data.series as ExploreSeriesItem[]);
	let setItems = $derived(data.sets as ExploreSetItem[]);
	let kindOptions = $derived(data.kinds.map((kind) => ({ slug: kind.slug, title: kind.title })));
	let kindFilterOptions = $derived([{ slug: "", title: "Todos" }, ...kindOptions]);
	let standalonePosts = $derived(getStandalonePosts(data.posts, seriesItems));
	let postSearchEntries = $derived(standalonePosts.map(createPostSearchEntry));
	let seriesSearchEntries = $derived(seriesItems.map(createSeriesSearchEntry));
	let setSearchEntries = $derived(setItems.map(createSetSearchEntry));
	let allTagOptions = $derived(buildTagOptions(standalonePosts));

	let scopeCounts = $derived({
		notes: standalonePosts.length,
		series: seriesItems.length,
		sets: setItems.length
	});

	let filteredPostEntries = $derived(filterPostEntries(filters, postSearchEntries));
	let filteredSeriesEntries = $derived(filterSeriesEntries(filters, seriesSearchEntries));
	let filteredSetEntries = $derived(filterSetEntries(filters, setSearchEntries));
	let sortedItems = $derived(
		buildExploreItems(filteredPostEntries, filteredSeriesEntries, filteredSetEntries)
	);
	let displayedItems = $derived(sortedItems.slice(0, visibleCount));

	function scrollToExploreTop() {
		if (typeof window === "undefined") {
			return;
		}

		if (scrollState.instance) {
			scrollState.instance.scrollTo(0, { immediate: true });
		} else {
			window.scrollTo({ top: 0, behavior: "auto" });
		}
	}

	function resetFilters() {
		filters = { ...DEFAULT_EXPLORE_FILTERS };
		searchDraft = "";
		scrollToExploreTop();
	}

	function loadMore() {
		visibleCount += 10;
	}

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		filters = buildExploreFiltersFromSearchParams(params, kindOptions);
		searchDraft = filters.text;
		hydrated = true;
	});

	$effect(() => {
		if (!hydrated) {
			return;
		}

		visibleCount = 10;

		const nextParams = buildExploreSearchParams(filters).toString();
		const currentParams = window.location.search.replace(/^\?/, "");
		if (nextParams === currentParams) {
			return;
		}

		const nextUrl = nextParams
			? `${window.location.pathname}?${nextParams}`
			: window.location.pathname;
		replaceState(nextUrl, page.state);
	});
</script>

<SEO
	title="Explorar Biblioteca | Garden of Vanities"
	description="Pesquise e filtre todas as notas do jardim."
/>

<div class="bg-surface">
	<div class="border-border flex h-13 items-center border-b px-5 md:px-7">
		<span
			class="font-heading text-text whitespace-nowrap"
			style="font-size: var(--type-2); font-weight: var(--font-weight-600);"
		>
			Explore
		</span>
	</div>
</div>

<section class="pb-8 md:pb-10">
	<ExploreToolbar
		bind:filters
		bind:searchDraft
		{kindFilterOptions}
		{scopeCounts}
		{postSearchEntries}
		{seriesSearchEntries}
		{setSearchEntries}
		{allTagOptions}
		{isSidebarExpanded}
		resultCount={sortedItems.length}
		headerHeight={EXPLORE_HEADER_HEIGHT}
	/>

	<Container size="full" class="pt-4">
		<div>
			<p class="text-muted mb-3 text-sm">
				{sortedItems.length} resultado{sortedItems.length === 1 ? "" : "s"}
			</p>

			{#if displayedItems.length > 0}
				<div class="w-full">
					<div class="w-full columns-1 gap-4 md:columns-2 xl:columns-3 2xl:columns-4">
						{#each displayedItems as item (item.key)}
							{#if item.type === "post"}
								<PostMasonryCard post={item.post} />
							{:else if item.type === "series"}
								<SeriesCard serie={item.serie} />
							{:else}
								<SetCard set={item.set} />
							{/if}
						{/each}
					</div>
				</div>

				{#if sortedItems.length > displayedItems.length}
					<div
						use:viewport
						onenterViewport={loadMore}
						class="flex w-full items-center justify-center p-8"
					>
						<Loader2 class="text-muted h-7 w-7 animate-spin" />
					</div>
				{/if}
			{:else}
				<div
					class="border-border bg-surface flex flex-col items-center justify-center rounded-xl border p-10 text-center md:p-16"
				>
					<p class="text-text text-lg font-medium">Nenhum resultado encontrado</p>
					<p class="text-muted mt-1 text-sm">Tente ajustar filtros, tags ou termo de busca.</p>
					<button
						type="button"
						onclick={resetFilters}
						class="focus-ring border-border hover:bg-surface-hover active:bg-surface-active text-text mt-4 rounded-md border px-3 py-2 text-sm transition-colors"
					>
						Limpar filtros
					</button>
				</div>
			{/if}
		</div>
	</Container>
</section>
