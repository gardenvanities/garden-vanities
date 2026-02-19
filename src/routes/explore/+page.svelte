<script lang="ts">
	import { replaceState } from "$app/navigation";
	import { page } from "$app/state";
	import { ChevronDown, Loader2, X } from "@lucide/svelte";
	import { onMount } from "svelte";

	import viewport from "$lib/actions/viewport";
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import { DEFAULT_EXPLORE_FILTERS, EXPLORE_SCOPE_OPTIONS } from "$lib/modules/explore/constants";
	import {
		buildExploreItems,
		buildSuggestionPool,
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
		buildTagSuggestions,
		buildTextSuggestions,
		clearActiveTagToken,
		consumeCommittedTags,
		getActiveTagQuery,
		getSuggestionTypeLabel,
		normalizeSearchInput,
		stripHashTokens
	} from "$lib/modules/explore/search";
	import {
		buildExploreFiltersFromSearchParams,
		buildExploreSearchParams,
		sanitizeTags
	} from "$lib/modules/explore/services";
	import SeriesCard from "$lib/modules/garden/components/SeriesCard.svelte";
	import SetCard from "$lib/modules/garden/components/SetCard.svelte";
	import PostMasonryCard from "$lib/modules/posts/components/PostMasonryCard.svelte";
	import { cn } from "$lib/shared/merge-class";
	import { ui } from "$lib/stores/ui.svelte";
	import type {
		ExploreFilters,
		ExploreScope,
		ExploreSeriesItem,
		ExploreSetItem,
		SearchSuggestion
	} from "$lib/modules/explore/types";

	let { data } = $props();

	const EXPLORE_HEADER_HEIGHT = 52;

	let filters = $state<ExploreFilters>({ ...DEFAULT_EXPLORE_FILTERS });
	let visibleCount = $state(10);
	let hydrated = $state(false);
	let searchQuery = $state("");
	let isSearchFocused = $state(false);
	let isSearchBarVisible = $state(true);
	let searchContainerElement = $state<HTMLElement | null>(null);
	let searchFieldElement = $state<HTMLElement | null>(null);
	let suggestionPanelElement = $state<HTMLElement | null>(null);
	let searchInputElement = $state<HTMLInputElement | null>(null);
	let lastScrollY = $state(0);
	let toolbarTopOffset = $state(EXPLORE_HEADER_HEIGHT);
	let suggestionPosition = $state({ top: 0, left: 0, width: 0 });
	let toolbarHeight = $state(0);
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

	let activeTagQuery = $derived(filters.scope === "notes" ? getActiveTagQuery(searchQuery) : null);
	let suggestionPool = $derived(
		buildSuggestionPool(filters.scope, postSearchEntries, seriesSearchEntries, setSearchEntries)
	);
	let textSuggestions = $derived(buildTextSuggestions(searchQuery, suggestionPool, activeTagQuery));
	let tagSuggestions = $derived(
		buildTagSuggestions(filters.scope, activeTagQuery, filters.tags, allTagOptions)
	);
	let hasTagSuggestionMode = $derived(activeTagQuery !== null && filters.scope === "notes");
	let showSuggestions = $derived(
		isSearchFocused &&
			(hasTagSuggestionMode ? tagSuggestions.length > 0 : textSuggestions.length > 0)
	);

	let filteredPostEntries = $derived(filterPostEntries(filters, postSearchEntries));
	let filteredSeriesEntries = $derived(filterSeriesEntries(filters, seriesSearchEntries));
	let filteredSetEntries = $derived(filterSetEntries(filters, setSearchEntries));
	let sortedItems = $derived(
		buildExploreItems(filteredPostEntries, filteredSeriesEntries, filteredSetEntries)
	);
	let displayedItems = $derived(sortedItems.slice(0, visibleCount));

	function updateSuggestionPosition() {
		if (!searchFieldElement) {
			return;
		}

		const rect = searchFieldElement.getBoundingClientRect();
		suggestionPosition = {
			top: rect.bottom + 6,
			left: rect.left,
			width: rect.width
		};
	}

	function updateToolbarHeight() {
		if (!searchContainerElement) {
			return;
		}

		toolbarHeight = Math.ceil(searchContainerElement.getBoundingClientRect().height);
	}

	function setFiltersWithDefaultPreset(nextFilters: Partial<ExploreFilters>) {
		filters = {
			...filters,
			...nextFilters,
			preset: "all"
		};
	}

	function resetFilters() {
		filters = { ...DEFAULT_EXPLORE_FILTERS };
		searchQuery = "";
	}

	function portalToBody(node: HTMLElement) {
		if (typeof document === "undefined") {
			return;
		}

		document.body.appendChild(node);

		return {
			destroy() {
				node.remove();
			}
		};
	}

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		filters = buildExploreFiltersFromSearchParams(params, kindOptions);
		searchQuery = filters.text;
		hydrated = true;
		lastScrollY = window.scrollY;
		toolbarTopOffset = Math.max(0, EXPLORE_HEADER_HEIGHT - window.scrollY);

		const closeOnOutside = (event: PointerEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) {
				return;
			}
			if (searchContainerElement?.contains(target)) {
				return;
			}
			if (suggestionPanelElement?.contains(target)) {
				return;
			}
			isSearchFocused = false;
		};

		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				isSearchFocused = false;
			}
		};

		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			const delta = currentScrollY - lastScrollY;
			toolbarTopOffset = Math.max(0, EXPLORE_HEADER_HEIGHT - currentScrollY);
			if (currentScrollY <= 24) {
				isSearchBarVisible = true;
			} else if (delta > 6) {
				isSearchBarVisible = false;
				isSearchFocused = false;
			} else if (delta < -6) {
				isSearchBarVisible = true;
			}
			lastScrollY = currentScrollY;
		};

		const handleResize = () => {
			updateToolbarHeight();
		};

		window.addEventListener("pointerdown", closeOnOutside);
		window.addEventListener("keydown", closeOnEscape);
		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("resize", handleResize);
		updateToolbarHeight();

		return () => {
			window.removeEventListener("pointerdown", closeOnOutside);
			window.removeEventListener("keydown", closeOnEscape);
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleResize);
		};
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

	$effect(() => {
		if (!showSuggestions) {
			return;
		}

		void searchQuery;
		void filters.tags.length;
		updateSuggestionPosition();

		const handleViewportChange = () => {
			updateSuggestionPosition();
		};

		window.addEventListener("resize", handleViewportChange);
		window.addEventListener("scroll", handleViewportChange, { passive: true });

		return () => {
			window.removeEventListener("resize", handleViewportChange);
			window.removeEventListener("scroll", handleViewportChange);
		};
	});

	$effect(() => {
		if (!hydrated) {
			return;
		}

		void filters.scope;
		void filters.tags.length;
		updateToolbarHeight();
	});

	function loadMore() {
		visibleCount += 10;
	}

	function selectScope(scope: ExploreScope) {
		const nextTags = scope === "notes" ? filters.tags : [];
		const nextKinds = scope === "notes" ? filters.kinds : [];
		setFiltersWithDefaultPreset({
			scope,
			tags: nextTags,
			kinds: nextKinds
		});
		searchQuery = filters.text;
	}

	function setKind(kindSlug: string) {
		setFiltersWithDefaultPreset({
			kinds: kindSlug ? [kindSlug] : []
		});
	}

	function clearSearch() {
		searchQuery = "";
		setFiltersWithDefaultPreset({
			text: "",
			tags: []
		});
	}

	function applySearch(value: string) {
		if (filters.scope === "notes") {
			const { nextInput, tags: committedTags } = consumeCommittedTags(value);
			const nextTags = sanitizeTags([...filters.tags, ...committedTags]);
			const nextText = stripHashTokens(nextInput);

			if (nextInput !== value) {
				searchQuery = nextInput;
			}

			setFiltersWithDefaultPreset({
				text: nextText,
				tags: nextTags
			});
			return;
		}

		setFiltersWithDefaultPreset({
			text: normalizeSearchInput(value),
			tags: [],
			kinds: []
		});
	}

	function applyTextSuggestion(suggestion: SearchSuggestion) {
		searchQuery = suggestion.value;
		applySearch(suggestion.value);
		isSearchFocused = false;
	}

	function applyTagSuggestion(tag: string) {
		const nextQuery = clearActiveTagToken(searchQuery);
		const nextTags = sanitizeTags([...filters.tags, tag]);

		searchQuery = nextQuery;
		setFiltersWithDefaultPreset({
			text: stripHashTokens(nextQuery),
			tags: nextTags
		});
		searchInputElement?.focus();
	}

	function removeTag(tag: string) {
		const nextTags = filters.tags.filter((item) => item !== tag);
		setFiltersWithDefaultPreset({
			text: stripHashTokens(searchQuery),
			tags: nextTags
		});
	}
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
		<div
			class={cn(
				"bg-background border-border duration-base ease-entrance fixed inset-x-0 z-30 border-b transition-transform",
				isSidebarExpanded ? "md:left-70" : "md:left-12",
				isSearchBarVisible ? "translate-y-0" : "pointer-events-none -translate-y-full"
			)}
			style:top={`${toolbarTopOffset}px`}
		>
		<Container size="full" class="px-0 sm:px-0 lg:px-0">
			<div>
				<div bind:this={searchContainerElement} class="px-3 py-3 md:px-5">
					<div class="relative">
						<label for="explore-search" class="sr-only">Buscar no explore</label>
						<div
							bind:this={searchFieldElement}
							class="border-border bg-surface-elevated flex min-h-12 items-center gap-2 rounded-lg border px-3"
						>
							<div class="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 py-1.5">
								{#if filters.scope === "notes" && filters.tags.length > 0}
									{#each filters.tags as tag (tag)}
										<button
											type="button"
											onclick={() => removeTag(tag)}
											class="focus-ring border-border bg-surface text-text hover:bg-surface-hover inline-flex h-7 shrink-0 items-center gap-1 rounded-sm border px-2 text-xs font-medium transition-colors"
										>
											<span>#{tag}</span>
											<X class="h-3 w-3" />
										</button>
									{/each}
								{/if}

								<input
									id="explore-search"
									bind:this={searchInputElement}
									type="search"
									value={searchQuery}
									autocomplete="off"
									onfocus={() => {
										isSearchFocused = true;
									}}
									onkeydown={(event) => {
										if (event.key !== "Enter") {
											return;
										}

										if (hasTagSuggestionMode && tagSuggestions.length > 0) {
											event.preventDefault();
											applyTagSuggestion(tagSuggestions[0].value);
											return;
										}

										if (textSuggestions.length > 0) {
											event.preventDefault();
											applyTextSuggestion(textSuggestions[0]);
										}
									}}
									oninput={(event) => {
										const target = event.currentTarget as HTMLInputElement;
										searchQuery = target.value;
										applySearch(target.value);
									}}
									placeholder="Pesquise por tema, título ou #tag"
									class="text-text placeholder:text-muted h-8 min-w-28 flex-1 border-none bg-transparent py-0 text-sm focus:outline-none"
								/>
							</div>

							{#if searchQuery || (filters.scope === "notes" && filters.tags.length > 0)}
								<button
									type="button"
									onclick={clearSearch}
									class="focus-ring text-muted hover:bg-surface-hover hover:text-text inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm transition-colors"
									aria-label="Limpar busca"
								>
									<X class="h-4 w-4" />
								</button>
							{/if}
						</div>

						{#if showSuggestions}
							<div
								use:portalToBody
								bind:this={suggestionPanelElement}
								class="border-border bg-surface fixed z-[calc(var(--z-nav)+24)] max-h-64 overflow-y-auto rounded-lg border p-1.5 shadow-lg"
								role="listbox"
								aria-label="Sugestões de busca"
								style="top: {suggestionPosition.top}px; left: {suggestionPosition.left}px; width: {suggestionPosition.width}px;"
							>
								{#if hasTagSuggestionMode}
									{#each tagSuggestions as suggestion (suggestion.value)}
										<button
											type="button"
											onclick={() => applyTagSuggestion(suggestion.value)}
											class="focus-ring hover:bg-surface-hover flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left transition-colors"
										>
											<span
												class="border-border bg-surface-elevated text-text inline-flex items-center rounded-sm border px-2 py-1 text-xs font-medium"
											>
												#{suggestion.value}
											</span>
											<span class="text-muted text-[11px]">{suggestion.count}</span>
										</button>
									{/each}
								{:else}
									{#each textSuggestions as suggestion (suggestion.id)}
										<button
											type="button"
											onclick={() => applyTextSuggestion(suggestion)}
											class="focus-ring hover:bg-surface-hover flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left transition-colors"
										>
											<span class="text-text truncate text-sm">{suggestion.label}</span>
											<span
												class="border-border bg-surface-elevated text-muted tracking-caps inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-medium uppercase"
											>
												{getSuggestionTypeLabel(suggestion.type)}
											</span>
										</button>
									{/each}
								{/if}
							</div>
						{/if}
					</div>

					<div class="mt-2 flex items-start gap-2 md:mt-2.5">
						<label for="explore-scope" class="sr-only">Tipo de conjunto</label>
						<div class="relative w-40 shrink-0 md:w-48">
							<select
								id="explore-scope"
								value={filters.scope}
								onchange={(event) =>
									selectScope((event.currentTarget as HTMLSelectElement).value as ExploreScope)}
								class="focus-ring border-border bg-surface-elevated text-text h-10 w-full appearance-none rounded-md border px-3 pr-8 text-sm"
							>
								{#each EXPLORE_SCOPE_OPTIONS as option (option.value)}
									<option value={option.value}>{option.label} ({scopeCounts[option.value]})</option>
								{/each}
							</select>
							<span
								class="text-muted pointer-events-none absolute inset-y-0 right-2 inline-flex items-center"
							>
								<ChevronDown size={15} strokeWidth={2} />
							</span>
						</div>

						{#if filters.scope === "notes"}
							<div class="scrollbar-none min-w-0 flex-1 overflow-x-auto">
								<div class="inline-flex min-w-max items-center gap-1">
									{#each kindFilterOptions as option (option.slug)}
										<button
											type="button"
											onclick={() => setKind(option.slug)}
											class={cn(
												"focus-ring border-border bg-surface text-muted hover:bg-surface-hover hover:text-text inline-flex h-10 shrink-0 items-center rounded-md border px-3 text-sm font-medium transition-colors",
												(option.slug === "" && filters.kinds.length === 0) ||
													filters.kinds[0] === option.slug
													? "border-border-vivid bg-surface-elevated text-text"
													: ""
											)}
										>
											{option.title}
										</button>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</Container>
	</div>
	<div
		style:height={`${toolbarHeight}px`}
		aria-hidden="true"
	></div>

	<Container size="full" class="pt-4">
		<div>
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
						class="focus-ring border-border hover:bg-surface-hover text-text mt-4 rounded-md border px-3 py-2 text-sm transition-colors"
					>
						Limpar filtros
					</button>
				</div>
			{/if}
		</div>
	</Container>
</section>
