<script lang="ts">
	import { onMount } from "svelte";
	import { replaceState } from "$app/navigation";
	import { page } from "$app/state";
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import ExploreToolbar from "$lib/modules/explore/components/ExploreToolbar.svelte";
	import {
		DEFAULT_EXPLORE_FILTERS,
		EXPLORE_SCOPE_OPTIONS
	} from "$lib/modules/explore/constants";
	import {
		buildExploreFiltersFromSearchParams,
		buildExploreSearchParams,
		sanitizeTags
	} from "$lib/modules/explore/services";
	import type { ExploreFilters } from "$lib/modules/explore/types";
	import SeriesCard from "$lib/modules/garden/components/SeriesCard.svelte";
	import SetCard from "$lib/modules/garden/components/SetCard.svelte";
	import type { CollectionStatus } from "$lib/modules/posts/collections";
	import PostMasonryCard from "$lib/modules/posts/components/PostMasonryCard.svelte";
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import viewport from "$lib/actions/viewport";
	import { Loader2, Search, SlidersHorizontal, X } from "@lucide/svelte";

	let { data } = $props();

	interface ExploreSeriesItem {
		slug: string;
		title: string;
		description?: string;
		cover?: { url: string; alt?: string };
		status: CollectionStatus;
		postCount: number;
		lastUpdated: string;
	}

	interface ExploreSetItem {
		slug: string;
		title: string;
		description?: string;
		count: number;
		href: string;
		cover?: { url: string; alt?: string };
		lastUpdated?: string;
	}

	type ExploreItem =
		| {
				type: "post";
				key: string;
				title: string;
				sortDate: number;
				post: PostFrontmatter;
		  }
		| {
				type: "series";
				key: string;
				title: string;
				sortDate: number;
				serie: ExploreSeriesItem;
		  }
		| {
				type: "set";
				key: string;
				title: string;
				sortDate: number;
				set: ExploreSetItem;
		  };

let filters = $state<ExploreFilters>({ ...DEFAULT_EXPLORE_FILTERS });
let visibleCount = $state(10);
let hydrated = $state(false);
let searchQuery = $state("");
let isFilterMenuOpen = $state(false);
let filterMenuElement = $state<HTMLElement | null>(null);
let filterButtonElement = $state<HTMLButtonElement | null>(null);

	let kindOptions = $derived(data.kinds.map((kind) => ({ slug: kind.slug, title: kind.title })));
	let seriesSlugSet = $derived(new Set(data.series.map((serie) => serie.slug)));

	let standalonePosts = $derived(
		data.posts.filter((post) => !post.series?.slug || !seriesSlugSet.has(post.series.slug))
	);

	function tokenizeText(value: string): string[] {
		return value
			.toLowerCase()
			.split(/\s+/)
			.map((term) => term.trim())
			.filter(Boolean);
	}

	let filteredPosts = $derived.by(() => {
		if (filters.scope === "sets") {
			return [];
		}

		const textTokens = tokenizeText(filters.text);
		const tags = filters.tags.map((tag) => tag.toLowerCase());
		const kinds = filters.kinds.map((kind) => kind.toLowerCase());

		return standalonePosts.filter((post) => {
			if (kinds.length > 0) {
				if (!post.kind || !kinds.includes(post.kind.toLowerCase())) {
					return false;
				}
			}

			if (tags.length > 0) {
				const postTags = (post.tags || []).map((tag) => tag.toLowerCase());
				if (!tags.every((tag) => postTags.includes(tag))) {
					return false;
				}
			}

			if (textTokens.length > 0) {
				const haystack = [post.title, post.subtitle, post.summary]
					.filter(Boolean)
					.join(" ")
					.toLowerCase();

				if (!textTokens.every((token) => haystack.includes(token))) {
					return false;
				}
			}

			return true;
		});
	});

	let filteredSeries = $derived.by(() => {
		if (filters.scope === "sets") {
			return [];
		}

		if (filters.kinds.length > 0 || filters.tags.length > 0) {
			return [];
		}

		const textTokens = tokenizeText(filters.text);
		let series = data.series as ExploreSeriesItem[];

		if (textTokens.length > 0) {
			series = series.filter((serie) => {
				const haystack = [serie.title, serie.description].filter(Boolean).join(" ").toLowerCase();
				return textTokens.every((token) => haystack.includes(token));
			});
		}

		return series;
	});

	let filteredSets = $derived.by(() => {
		if (filters.scope !== "sets") {
			return [];
		}

		if (filters.kinds.length > 0 || filters.tags.length > 0) {
			return [];
		}

		const textTokens = tokenizeText(filters.text);
		let sets = data.sets as ExploreSetItem[];

		if (textTokens.length > 0) {
			sets = sets.filter((set) => {
				const haystack = [set.title, set.description].filter(Boolean).join(" ").toLowerCase();
				return textTokens.every((token) => haystack.includes(token));
			});
		}

		return sets;
	});

	let sortedItems = $derived.by(() => {
		const items: ExploreItem[] = [
			...filteredPosts.map((post) => ({
				type: "post" as const,
				key: `post:${post.slug}`,
				title: post.title,
				sortDate: new Date(post.publishedAt || post.updatedAt || 0).getTime(),
				post
			})),
			...filteredSeries.map((serie) => ({
				type: "series" as const,
				key: `series:${serie.slug}`,
				title: serie.title,
				sortDate: new Date(serie.lastUpdated || 0).getTime(),
				serie
			})),
			...filteredSets.map((set) => ({
				type: "set" as const,
				key: `set:${set.slug}`,
				title: set.title,
				sortDate: new Date(set.lastUpdated || 0).getTime(),
				set
			}))
		];

		switch (filters.sortBy) {
			case "oldest":
				return items.sort((a, b) => a.sortDate - b.sortDate);
			case "az":
				return items.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
			default:
				return items.sort((a, b) => b.sortDate - a.sortDate);
		}
	});

	let displayedItems = $derived(sortedItems.slice(0, visibleCount));
	let scopeCounts = $derived({
		all: standalonePosts.length + data.series.length,
		sets: data.sets.length
	});
	let activeFilterCount = $derived(
		(filters.scope !== DEFAULT_EXPLORE_FILTERS.scope ? 1 : 0) +
			(filters.sortBy !== DEFAULT_EXPLORE_FILTERS.sortBy ? 1 : 0) +
			(filters.kinds.length > 0 ? 1 : 0) +
			(filters.tags.length > 0 ? 1 : 0)
	);

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		filters = buildExploreFiltersFromSearchParams(params, kindOptions);
		searchQuery = [filters.text, ...filters.tags.map((tag) => `#${tag}`)].filter(Boolean).join(" ").trim();
		hydrated = true;

		const closeOnOutside = (event: PointerEvent) => {
			if (!isFilterMenuOpen) {
				return;
			}

			const target = event.target;
			if (!(target instanceof Node)) {
				return;
			}

			if (filterMenuElement?.contains(target) || filterButtonElement?.contains(target)) {
				return;
			}

			isFilterMenuOpen = false;
		};

		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				isFilterMenuOpen = false;
			}
		};

		window.addEventListener("pointerdown", closeOnOutside);
		window.addEventListener("keydown", closeOnEscape);

		return () => {
			window.removeEventListener("pointerdown", closeOnOutside);
			window.removeEventListener("keydown", closeOnEscape);
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

		const nextUrl = nextParams ? `${window.location.pathname}?${nextParams}` : window.location.pathname;
		replaceState(nextUrl, page.state);
	});

	function loadMore() {
		visibleCount += 10;
	}

	function selectScope(scope: ExploreFilters["scope"]) {
		filters = {
			...filters,
			scope,
			kinds: scope === "sets" ? [] : filters.kinds,
			tags: scope === "sets" ? [] : filters.tags,
			preset: "all"
		};
		if (scope === "sets") {
			searchQuery = filters.text;
		}
	}

	function applySearch(value: string) {
		const rawTags = Array.from(value.matchAll(/#([^\s#]+)/g), (match) => match[1]);
		const nextTags = sanitizeTags(rawTags);
		const cleanText = value.replace(/(^|\s)#[^\s#]+/g, " ").replace(/\s+/g, " ").trim();

		filters = {
			...filters,
			text: cleanText,
			tags: filters.scope === "sets" ? [] : nextTags,
			preset: "all"
		};
	}

</script>

<SEO
	title="Explorar Biblioteca | Garden of Vanities"
	description="Pesquise e filtre todas as notas do jardim."
/>

<div class="bg-surface">
	<div class="flex h-13 items-center border-b border-border px-5 md:px-7">
		<span
			class="font-heading whitespace-nowrap text-text"
			style="font-size: var(--type-2); font-weight: var(--font-weight-600);"
		>
			Explore
		</span>
	</div>
</div>

<section class="pb-8 md:pb-10">
	<Container size="full" class="mb-4 px-0 sm:px-0 lg:px-0">
		<div class="relative w-full border-b border-border bg-surface-elevated">
			<div class="relative flex h-12 items-center gap-3 px-3 text-muted">
				<span class="inline-flex h-[1.2rem] w-[1.2rem] shrink-0 items-center justify-center">
					<Search size={16} strokeWidth={2} />
				</span>
				<input
					type="search"
					value={searchQuery}
					oninput={(event) => {
						const target = event.currentTarget as HTMLInputElement;
						searchQuery = target.value;
						applySearch(target.value);
					}}
					placeholder="Digite um tema ou use #tag..."
					class="h-full min-w-0 flex-1 border-none bg-transparent py-0 pl-0 text-sm text-text focus:outline-none"
				/>
				<div class="flex items-center gap-1">
					{#if searchQuery}
						<button
							type="button"
							onclick={() => {
								searchQuery = "";
								filters = { ...filters, text: "", tags: [], preset: "all" };
							}}
							class="inline-flex h-7 w-7 items-center justify-center rounded-sm text-muted transition-colors hover:bg-surface-hover hover:text-text"
							aria-label="Limpar busca"
						>
							<X class="h-4 w-4" />
						</button>
					{/if}

					<button
						type="button"
						bind:this={filterButtonElement}
						onclick={() => {
							isFilterMenuOpen = !isFilterMenuOpen;
						}}
						class="focus-ring inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2 text-xs text-muted transition-colors hover:bg-surface-hover hover:text-text"
						aria-expanded={isFilterMenuOpen}
						aria-haspopup="dialog"
						aria-label="Abrir filtros"
					>
						<SlidersHorizontal size={14} strokeWidth={2} />
						<span>Filtros</span>
						<span class="rounded-full border border-border px-1.5 py-0.5 text-[10px] text-text">
							{activeFilterCount}
						</span>
					</button>
				</div>
			</div>

			{#if isFilterMenuOpen}
				<div
					bind:this={filterMenuElement}
					class="absolute top-[calc(100%+0.4rem)] right-3 z-[calc(var(--z-nav)+1)] w-[22rem] max-w-[calc(100vw-1.5rem)] rounded-lg border border-border bg-surface p-3 shadow-[0_8px_32px_oklch(0_0_0/0.22)]"
				>
					<div class="mb-2 flex flex-wrap gap-1.5">
						{#each EXPLORE_SCOPE_OPTIONS as option (option.value)}
							<button
								type="button"
								onclick={() => selectScope(option.value)}
								class="focus-ring inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors {filters.scope ===
								option.value
									? 'border-border-vivid bg-surface-elevated text-text'
									: 'border-border bg-surface text-muted hover:bg-surface-hover hover:text-text'}"
							>
								<span>{option.label}</span>
								<span class="rounded-full bg-background/20 px-1.5 py-0.5 text-[10px]">{scopeCounts[option.value]}</span>
							</button>
						{/each}
					</div>
					<ExploreToolbar bind:filters kindOptions={kindOptions} resultCount={sortedItems.length} class="border-t border-border pt-2.5" />
				</div>
			{/if}
		</div>
	</Container>

	<Container size="full">
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
					<div use:viewport onenterViewport={loadMore} class="flex w-full items-center justify-center p-8">
						<Loader2 class="h-7 w-7 animate-spin text-muted" />
					</div>
				{/if}
			{:else}
				<div class="flex flex-col items-center justify-center rounded-xl border border-border bg-surface p-10 text-center md:p-16">
					<p class="text-lg font-medium text-text">Nenhum resultado encontrado</p>
					<p class="mt-1 text-sm text-muted">Tente ajustar filtros, tags ou termo de busca.</p>
					<button
						type="button"
						onclick={() => {
							filters = { ...DEFAULT_EXPLORE_FILTERS };
						}}
						class="focus-ring mt-4 rounded-md border border-border px-3 py-2 text-sm text-text transition-colors hover:bg-surface-hover"
					>
						Limpar filtros
					</button>
				</div>
			{/if}
		</div>
	</Container>
</section>
