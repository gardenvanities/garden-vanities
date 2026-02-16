<script lang="ts">
	import { onMount } from "svelte";
	import { replaceState } from "$app/navigation";
	import { page } from "$app/state";
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import ExploreToolbar from "$lib/modules/explore/components/ExploreToolbar.svelte";
	import { DEFAULT_EXPLORE_FILTERS, EXPLORE_SCOPE_OPTIONS } from "$lib/modules/explore/constants";
	import {
		buildExploreFiltersFromSearchParams,
		buildExploreSearchParams
	} from "$lib/modules/explore/services";
	import type { ExploreFilters } from "$lib/modules/explore/types";
	import SeriesCard from "$lib/modules/garden/components/SeriesCard.svelte";
	import SetCard from "$lib/modules/garden/components/SetCard.svelte";
	import type { CollectionStatus } from "$lib/modules/posts/collections";
	import PostMasonryCard from "$lib/modules/posts/components/PostMasonryCard.svelte";
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import PageHeader from "$lib/ui/PageHeader.svelte";
	import viewport from "$lib/actions/viewport";
	import { Filter, Loader2, Search, X } from "@lucide/svelte";

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
	let isMobileFiltersOpen = $state(false);

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
	let totalExploreItems = $derived(standalonePosts.length + data.series.length + data.sets.length);
	let scopeCounts = $derived({
		all: standalonePosts.length + data.series.length,
		sets: data.sets.length
	});

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		filters = buildExploreFiltersFromSearchParams(params, kindOptions);
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
	}
</script>

<SEO
	title="Explorar Biblioteca | Garden of Vanities"
	description="Pesquise e filtre todas as notas do jardim."
/>

<Section class="py-10 md:py-14">
	<Container size="xl">
		<div class="mb-8 flex flex-col items-center">
			<PageHeader
				class="mb-0 text-center"
				title="Explorar"
				description="Descubra entre {totalExploreItems} conteúdos cultivados"
			/>
		</div>

		<div class="bg-base/95 border-border sticky top-2 z-20 mb-5 rounded-lg border p-2 backdrop-blur">
			<div class="flex items-center gap-2">
				<div class="relative flex-1">
					<Search class="text-muted-foreground pointer-events-none absolute top-2.5 left-3 h-4 w-4" />
					<input
						type="search"
						value={filters.text}
						oninput={(event) => {
							const target = event.currentTarget as HTMLInputElement;
							filters = { ...filters, text: target.value, preset: "all" };
						}}
						placeholder="Buscar por título, resumo, descrição..."
						class="bg-background border-border focus-visible:ring-ring h-9 w-full rounded-md border py-1.5 pr-9 pl-9 text-sm focus-visible:ring-2 focus-visible:outline-none"
					/>
					{#if filters.text}
						<button
							type="button"
							onclick={() => {
								filters = { ...filters, text: "", preset: "all" };
							}}
							class="text-muted-foreground hover:text-foreground absolute top-2.5 right-2"
							aria-label="Limpar busca"
						>
							<X class="h-4 w-4" />
						</button>
					{/if}
				</div>

				<button
					type="button"
					onclick={() => {
						isMobileFiltersOpen = true;
					}}
					class="bg-background border-border inline-flex h-9 items-center gap-1 rounded-md border px-2 text-xs lg:hidden"
				>
					<Filter class="h-3.5 w-3.5" />
					<span>Filtros</span>
				</button>
			</div>

			<div class="mt-2 flex flex-wrap gap-1.5">
				{#each EXPLORE_SCOPE_OPTIONS as option (option.value)}
					<button
						type="button"
						onclick={() => selectScope(option.value)}
						class="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors {filters.scope ===
						option.value
							? 'bg-primary text-primary-foreground border-primary'
							: 'bg-background border-border text-muted-foreground hover:bg-muted hover:text-foreground'}"
					>
						<span>{option.label}</span>
						<span
							class="bg-background/70 text-[10px] leading-none rounded-full px-1.5 py-0.5 {filters.scope ===
							option.value
								? 'text-primary'
								: 'text-muted-foreground'}"
						>
							{scopeCounts[option.value]}
						</span>
					</button>
				{/each}
			</div>
		</div>

		<div class="grid grid-cols-1 gap-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
			<aside class="hidden lg:block">
				<div class="sticky top-16">
					<ExploreToolbar bind:filters kindOptions={kindOptions} resultCount={sortedItems.length} />
				</div>
			</aside>

			<div>
				{#if displayedItems.length > 0}
					<div class="columns-1 gap-5 sm:columns-2 xl:columns-3">
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

					{#if sortedItems.length > displayedItems.length}
						<div
							use:viewport
							onenterViewport={loadMore}
							class="flex w-full items-center justify-center p-8"
						>
							<Loader2 class="text-muted/50 h-8 w-8 animate-spin" />
						</div>
					{/if}
				{:else}
					<div class="bg-muted/10 flex flex-col items-center justify-center rounded-lg border py-20 text-center">
						<p class="text-foreground text-lg font-medium">Nenhum resultado encontrado</p>
						<p class="text-muted-foreground">Tente ajustar seus filtros ou pesquisa.</p>
						<button
							type="button"
							onclick={() => {
								filters = { ...DEFAULT_EXPLORE_FILTERS };
							}}
							class="text-primary mt-4 hover:underline"
						>
							Limpar filtros
						</button>
					</div>
				{/if}
			</div>
		</div>
	</Container>
</Section>

{#if isMobileFiltersOpen}
	<div class="fixed inset-0 z-50 lg:hidden">
		<button
			type="button"
			onclick={() => {
				isMobileFiltersOpen = false;
			}}
			class="bg-background/70 absolute inset-0"
			aria-label="Fechar filtros"
		></button>
		<div class="bg-base border-border absolute top-0 right-0 h-full w-full max-w-xs border-l p-3">
			<div class="mb-3 flex items-center justify-between">
				<p class="text-sm font-medium">Filtros</p>
				<button
					type="button"
					onclick={() => {
						isMobileFiltersOpen = false;
					}}
					class="text-muted-foreground hover:text-foreground"
					aria-label="Fechar"
				>
					<X class="h-4 w-4" />
				</button>
			</div>
			<ExploreToolbar bind:filters kindOptions={kindOptions} resultCount={sortedItems.length} />
		</div>
	</div>
{/if}
