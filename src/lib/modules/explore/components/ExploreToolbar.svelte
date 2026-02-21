<script lang="ts">
	import { Plus, X } from "@lucide/svelte";
	import { onMount } from "svelte";

	import Container from "$lib/layout/Container.svelte";
	import { DEFAULT_EXPLORE_FILTERS, EXPLORE_SCOPE_OPTIONS } from "$lib/modules/explore/constants";
	import {
		buildSuggestionPool,
		type ExplorePostSearchEntry,
		type ExploreSeriesSearchEntry,
		type ExploreSetSearchEntry
	} from "$lib/modules/explore/filtering";
	import {
		clearActiveTagToken,
		consumeCommittedTags,
		normalizeSearchInput,
		stripHashTokens
	} from "$lib/modules/explore/search";
	import {
		buildExploreSuggestionState,
		type ExploreNavigableSuggestionItem
	} from "$lib/modules/explore/suggestions";
	import { sanitizeTags } from "$lib/modules/explore/services";
	import { cn } from "$lib/shared/merge-class";
	import { scrollState } from "$lib/stores/scroll.svelte";
	import type {
		ExploreFilters,
		ExploreKindOption,
		ExploreScope,
		TagSuggestion
	} from "$lib/modules/explore/types";

	interface Props {
		filters: ExploreFilters;
		searchDraft: string;
		kindFilterOptions: ExploreKindOption[];
		scopeCounts: Record<ExploreScope, number>;
		postSearchEntries: ExplorePostSearchEntry[];
		seriesSearchEntries: ExploreSeriesSearchEntry[];
		setSearchEntries: ExploreSetSearchEntry[];
		allTagOptions: TagSuggestion[];
		isSidebarExpanded: boolean;
		resultCount: number;
		headerHeight?: number;
	}

	interface ApplySearchOptions {
		scrollToTop?: boolean;
		closeSuggestions?: boolean;
		recordRecent?: boolean;
	}

	type TagNavigableSuggestionItem = Extract<ExploreNavigableSuggestionItem, { kind: "tag" }>;

	const INPUT_DEBOUNCE_MS = 180;
	const RECENT_SEARCHES_KEY = "gv-explore-recent-searches";
	const MAX_RECENT_SEARCHES = 6;
	const SUGGESTION_LISTBOX_ID = "explore-search-suggestions";
	const MAX_SEARCH_LINE_BREAKS = 2;
	const MAX_SEARCH_HEIGHT = 72;
	const MIN_SEARCH_HEIGHT = 32;
	const SCOPE_OPTION_IDS: Record<ExploreScope, string> = {
		notes: "explore-scope-notes",
		series: "explore-scope-series",
		sets: "explore-scope-sets"
	};

	let {
		filters = $bindable(),
		searchDraft = $bindable(),
		kindFilterOptions,
		scopeCounts,
		postSearchEntries,
		seriesSearchEntries,
		setSearchEntries,
		allTagOptions,
		isSidebarExpanded,
		resultCount,
		headerHeight = 52
	}: Props = $props();

	let isSearchFocused = $state(false);
	let isSearchBarVisible = $state(true);
	let isFilterMenuOpen = $state(false);
	let searchContainerElement = $state<HTMLElement | null>(null);
	let searchFieldElement = $state<HTMLElement | null>(null);
	let suggestionPanelElement = $state<HTMLElement | null>(null);
	let searchInputElement = $state<HTMLTextAreaElement | null>(null);
	let lastScrollY = $state(0);
	let toolbarTopOffset = $state(0);
	let toolbarHeight = $state(0);
	let suggestionPosition = $state({ top: 0, left: 0, width: 0 });
	let activeSuggestionIndex = $state(-1);
	let applyDebounceTimer = $state<number | null>(null);
	let recentSearches = $state<string[]>([]);

	let noteSuggestionPool = $derived(
		buildSuggestionPool("notes", postSearchEntries, seriesSearchEntries, setSearchEntries)
	);
	let seriesSuggestionPool = $derived(
		buildSuggestionPool("series", postSearchEntries, seriesSearchEntries, setSearchEntries)
	);
	let setSuggestionPool = $derived(
		buildSuggestionPool("sets", postSearchEntries, seriesSearchEntries, setSearchEntries)
	);
	let suggestionPoolByScope = $derived({
		notes: noteSuggestionPool,
		series: seriesSuggestionPool,
		sets: setSuggestionPool
	});
	let suggestionState = $derived.by(() =>
		buildExploreSuggestionState({
			scope: filters.scope,
			searchDraft,
			selectedTags: filters.tags,
			recentSearches,
			suggestionPoolByScope,
			tagOptions: allTagOptions
		})
	);
	let suggestionMode = $derived(suggestionState.mode);
	let activeTagQuery = $derived(suggestionState.activeTagQuery);
	let tagSuggestions = $derived(suggestionState.tagSuggestions);
	let hasTagSuggestionMode = $derived(suggestionMode === "tag");
	let normalizedSearchTerm = $derived(normalizeSearchInput(stripHashTokens(searchDraft)));
	let navigableSuggestionItems = $derived(
		suggestionState.items.filter(
			(item): item is TagNavigableSuggestionItem => item.kind === "tag"
		)
	);
	let suggestionIndexByKey = $derived.by(() => {
		const map: Record<string, number> = {};
		navigableSuggestionItems.forEach((item, index) => {
			map[item.key] = index;
		});
		return map;
	});
	let visibleSuggestionCount = $derived(navigableSuggestionItems.length);
	let showSuggestions = $derived(isSearchFocused && hasTagSuggestionMode);
	let advancedFilterCount = $derived(filters.kinds.length);
	let hasKindFilterTokens = $derived(filters.kinds.length > 0);
	let activeFilterCount = $derived(
		(filters.text.length > 0 ? 1 : 0) +
			filters.tags.length +
			filters.kinds.length +
			(filters.scope !== DEFAULT_EXPLORE_FILTERS.scope ? 1 : 0)
	);
	let shouldPinToolbar = $derived(isSearchFocused || isFilterMenuOpen);
	let liveRegionMessage = $derived(
		`${resultCount} resultado${resultCount === 1 ? "" : "s"} e ${activeFilterCount} filtro${activeFilterCount === 1 ? "" : "s"} ativo${activeFilterCount === 1 ? "" : "s"}.`
	);

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

	function clampSearchDraft(value: string): string {
		const normalized = value.replace(/\r\n/g, "\n");
		const lines = normalized.split("\n");
		if (lines.length <= MAX_SEARCH_LINE_BREAKS + 1) {
			return normalized;
		}
		return lines.slice(0, MAX_SEARCH_LINE_BREAKS + 1).join("\n");
	}

	function syncSearchTextareaHeight() {
		if (!searchInputElement) {
			return;
		}

		searchInputElement.style.height = `${MIN_SEARCH_HEIGHT}px`;
		const nextHeight = Math.min(searchInputElement.scrollHeight, MAX_SEARCH_HEIGHT);
		searchInputElement.style.height = `${Math.max(MIN_SEARCH_HEIGHT, nextHeight)}px`;
	}

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

	function clearApplyDebounce() {
		if (applyDebounceTimer === null || typeof window === "undefined") {
			return;
		}
		window.clearTimeout(applyDebounceTimer);
		applyDebounceTimer = null;
	}

	function queueApplySearch(value: string) {
		clearApplyDebounce();
		if (typeof window === "undefined") {
			applySearch(value, { scrollToTop: false });
			return;
		}

		applyDebounceTimer = window.setTimeout(() => {
			applyDebounceTimer = null;
			applySearch(value, { scrollToTop: false });
		}, INPUT_DEBOUNCE_MS);
	}

	function saveRecentSearches(nextSearches: string[]) {
		if (typeof window === "undefined") {
			return;
		}

		window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(nextSearches));
	}

	function loadRecentSearches() {
		if (typeof window === "undefined") {
			return;
		}

		try {
			const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
			if (!raw) {
				recentSearches = [];
				return;
			}

			const parsed = JSON.parse(raw);
			if (!Array.isArray(parsed)) {
				recentSearches = [];
				return;
			}

			recentSearches = parsed
				.filter((item): item is string => typeof item === "string")
				.map((item) => normalizeSearchInput(item))
				.filter(Boolean)
				.slice(0, MAX_RECENT_SEARCHES);
		} catch {
			recentSearches = [];
		}
	}

	function pushRecentSearch(value: string) {
		const normalized = normalizeSearchInput(stripHashTokens(value));
		if (!normalized) {
			return;
		}

		const nextSearches = [
			normalized,
			...recentSearches.filter((item) => item.toLowerCase() !== normalized.toLowerCase())
		].slice(0, MAX_RECENT_SEARCHES);

		recentSearches = nextSearches;
		saveRecentSearches(nextSearches);
	}

	function scrollToExploreTop() {
		if (typeof window === "undefined") {
			return;
		}

		isSearchBarVisible = true;

		if (window.scrollY <= 1) {
			toolbarTopOffset = headerHeight;
			lastScrollY = 0;
			return;
		}

		if (scrollState.instance) {
			scrollState.instance.scrollTo(0, { immediate: true });
		} else {
			window.scrollTo({ top: 0, behavior: "auto" });
		}

		toolbarTopOffset = headerHeight;
		lastScrollY = 0;
	}

	function setFilters(
		nextFilters: Partial<ExploreFilters>,
		options: { scrollToTop?: boolean } = {}
	) {
		filters = {
			...filters,
			...nextFilters
		};

		if (options.scrollToTop) {
			scrollToExploreTop();
		}
	}

	function getSuggestionOptionId(index: number): string {
		return `explore-suggestion-option-${index}`;
	}

	function getSuggestionIndex(key: string): number {
		return suggestionIndexByKey[key] ?? -1;
	}

	function setActiveSuggestionByKey(key: string) {
		const index = getSuggestionIndex(key);
		if (index >= 0) {
			activeSuggestionIndex = index;
		}
	}

	function getSuggestionItemByIndex(index: number): TagNavigableSuggestionItem | null {
		if (index < 0 || index >= navigableSuggestionItems.length) {
			return null;
		}
		return navigableSuggestionItems[index] ?? null;
	}

	function moveActiveSuggestion(step: 1 | -1) {
		if (visibleSuggestionCount === 0) {
			activeSuggestionIndex = -1;
			return;
		}

		if (activeSuggestionIndex < 0) {
			activeSuggestionIndex = step > 0 ? 0 : visibleSuggestionCount - 1;
			return;
		}

		if (step > 0) {
			activeSuggestionIndex = (activeSuggestionIndex + 1) % visibleSuggestionCount;
			return;
		}

		activeSuggestionIndex = (activeSuggestionIndex - 1 + visibleSuggestionCount) % visibleSuggestionCount;
	}

	function applySuggestionItem(item: TagNavigableSuggestionItem) {
		applyTagSuggestion(item.tag.value);
	}

	function applyActiveSuggestion() {
		const activeItem = getSuggestionItemByIndex(activeSuggestionIndex);
		if (activeItem) {
			applySuggestionItem(activeItem);
			return;
		}

		const firstItem = getSuggestionItemByIndex(0);
		if (suggestionMode === "tag" && firstItem) {
			applySuggestionItem(firstItem);
		}
	}

	function applySuggestionByKey(key: string) {
		const index = getSuggestionIndex(key);
		const item = getSuggestionItemByIndex(index);
		if (item) {
			applySuggestionItem(item);
		}
	}

	function closeSuggestionUi() {
		isSearchFocused = false;
		isFilterMenuOpen = false;
		activeSuggestionIndex = -1;
		searchInputElement?.blur();
	}

	function getScopeEmoji(scope: ExploreScope): string {
		if (scope === "series") {
			return "📚";
		}
		if (scope === "sets") {
			return "🗂️";
		}
		return "📝";
	}


	function selectScope(scope: ExploreScope) {
		clearApplyDebounce();
		const nextDraft =
			scope === "notes" ? searchDraft : normalizeSearchInput(searchDraft.replace(/#/g, " "));
		searchDraft = nextDraft;

		setFilters(
			{
				scope,
				text: stripHashTokens(nextDraft),
				tags: scope === "notes" ? filters.tags : [],
				kinds: scope === "notes" ? filters.kinds : []
			},
			{ scrollToTop: true }
		);

		isFilterMenuOpen = false;
		activeSuggestionIndex = -1;
	}

	function setKind(kindSlug: string, options: { scrollToTop?: boolean } = { scrollToTop: true }) {
		setFilters(
			{
				kinds: kindSlug ? [kindSlug] : []
			},
			{ scrollToTop: options.scrollToTop }
		);
	}

	function clearKindFilters() {
		setFilters(
			{
				kinds: []
			},
			{ scrollToTop: true }
		);
	}

	function applySearch(value: string, options: ApplySearchOptions = {}) {
		let recentCandidate = "";

		if (filters.scope === "notes") {
			const { nextInput, tags: committedTags } = consumeCommittedTags(value);
			const nextTags = sanitizeTags([...filters.tags, ...committedTags]);
			const nextText = stripHashTokens(nextInput);

			if (nextInput !== value) {
				searchDraft = nextInput;
			}

			recentCandidate = nextText;
			setFilters(
				{
					text: nextText,
					tags: nextTags
				},
				{ scrollToTop: options.scrollToTop }
			);
		} else {
			const nextText = normalizeSearchInput(value.replace(/#/g, " "));
			recentCandidate = nextText;
			setFilters(
				{
					text: nextText,
					tags: [],
					kinds: []
				},
				{ scrollToTop: options.scrollToTop }
			);
		}

		if (options.recordRecent) {
			pushRecentSearch(recentCandidate);
		}

		if (options.closeSuggestions) {
			isSearchFocused = false;
			activeSuggestionIndex = -1;
		}
	}

	function applyTagSuggestion(tag: string) {
		clearApplyDebounce();
		const nextQuery = clearActiveTagToken(searchDraft);
		const nextTags = sanitizeTags([...filters.tags, tag]);

		searchDraft = nextQuery;
		setFilters(
			{
				text: stripHashTokens(nextQuery),
				tags: nextTags
			},
			{ scrollToTop: true }
		);
		activeSuggestionIndex = -1;
		searchInputElement?.focus();
	}

	function removeTag(tag: string, options: { scrollToTop?: boolean } = {}) {
		const nextTags = filters.tags.filter((item) => item !== tag);
		setFilters(
			{
				text: stripHashTokens(searchDraft),
				tags: nextTags
			},
			{ scrollToTop: options.scrollToTop }
		);
	}

	function toggleFilterMenu() {
		isFilterMenuOpen = !isFilterMenuOpen;
		if (isFilterMenuOpen) {
			isSearchFocused = false;
			activeSuggestionIndex = -1;
		}
	}

	function focusSearchInput() {
		isSearchFocused = true;
		isFilterMenuOpen = false;
		searchInputElement?.focus();
	}

	function isTypingTarget(target: EventTarget | null): boolean {
		return (
			target instanceof HTMLInputElement ||
			target instanceof HTMLTextAreaElement ||
			(target instanceof HTMLElement && target.isContentEditable)
		);
	}

	function handleScopeKeydown(event: KeyboardEvent, scope: ExploreScope) {
		if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
			return;
		}

		event.preventDefault();
		const currentIndex = EXPLORE_SCOPE_OPTIONS.findIndex((item) => item.value === scope);
		if (currentIndex < 0) {
			return;
		}

		const nextIndex =
			event.key === "ArrowRight"
				? (currentIndex + 1) % EXPLORE_SCOPE_OPTIONS.length
				: (currentIndex - 1 + EXPLORE_SCOPE_OPTIONS.length) % EXPLORE_SCOPE_OPTIONS.length;
		const nextScope = EXPLORE_SCOPE_OPTIONS[nextIndex].value;
		selectScope(nextScope);
		const nextElement = document.getElementById(SCOPE_OPTION_IDS[nextScope]);
		nextElement?.focus();
	}

	function handleSearchInput(event: Event) {
		const target = event.currentTarget as HTMLTextAreaElement;
		const value = clampSearchDraft(target.value);
		if (value !== target.value) {
			target.value = value;
		}
		searchDraft = value;
		syncSearchTextareaHeight();
		queueApplySearch(value);
	}

	function handleSearchKeydown(event: KeyboardEvent) {
		const target = event.currentTarget as HTMLTextAreaElement;

		if (event.key === "Backspace" && filters.scope === "notes" && filters.tags.length > 0) {
			if (target.value.trim().length === 0) {
				event.preventDefault();
				removeTag(filters.tags[filters.tags.length - 1], { scrollToTop: false });
			}
			return;
		}

		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			if (visibleSuggestionCount === 0) {
				return;
			}

			event.preventDefault();
			moveActiveSuggestion(event.key === "ArrowDown" ? 1 : -1);
			return;
		}

		if (event.key === "Tab" && showSuggestions && visibleSuggestionCount > 0) {
			event.preventDefault();
			moveActiveSuggestion(event.shiftKey ? -1 : 1);
			return;
		}

		if (event.key === "Enter" && !event.shiftKey) {
			if (
				showSuggestions &&
				visibleSuggestionCount > 0 &&
				(activeSuggestionIndex >= 0 || suggestionMode === "tag")
			) {
				event.preventDefault();
				applyActiveSuggestion();
				return;
			}

			if ((event.ctrlKey || event.metaKey) && normalizedSearchTerm.length > 0) {
				event.preventDefault();
				applySearch(searchDraft, {
					scrollToTop: true,
					closeSuggestions: true,
					recordRecent: true
				});
			}
			return;
		}

		if (event.key === "Escape") {
			event.stopPropagation();
			closeSuggestionUi();
		}
	}

	function handleSearchBlur() {
		if (typeof document === "undefined") {
			return;
		}

		queueMicrotask(() => {
			const activeElement = document.activeElement;
			if (!(activeElement instanceof Node)) {
				closeSuggestionUi();
				return;
			}

			const isInsideToolbar = searchContainerElement?.contains(activeElement) ?? false;
			const isInsideSuggestionPanel = suggestionPanelElement?.contains(activeElement) ?? false;
			if (isInsideToolbar || isInsideSuggestionPanel) {
				return;
			}

			isSearchFocused = false;
			activeSuggestionIndex = -1;
		});
	}

	onMount(() => {
		if (typeof window === "undefined") {
			return;
		}

		lastScrollY = window.scrollY;
		toolbarTopOffset = Math.max(0, headerHeight - window.scrollY);
		loadRecentSearches();

		const closeOnOutside = (event: PointerEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) {
				return;
			}

			const insideSearchContainer = searchContainerElement?.contains(target) ?? false;
			const insideSuggestionPanel = suggestionPanelElement?.contains(target) ?? false;
			if (insideSearchContainer || insideSuggestionPanel) {
				return;
			}

			closeSuggestionUi();
		};

		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeSuggestionUi();
			}
		};

		const handleShortcut = (event: KeyboardEvent) => {
			const target = event.target;
			if (isTypingTarget(target)) {
				return;
			}

			if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey) {
				event.preventDefault();
				focusSearchInput();
				return;
			}

			if ((event.key === "k" || event.key === "K") && (event.ctrlKey || event.metaKey)) {
				event.preventDefault();
				focusSearchInput();
				return;
			}

			if ((event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey) {
				if (event.key === "1") {
					event.preventDefault();
					selectScope("notes");
					return;
				}

				if (event.key === "2") {
					event.preventDefault();
					selectScope("series");
					return;
				}

				if (event.key === "3") {
					event.preventDefault();
					selectScope("sets");
				}
			}
		};

		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			const delta = currentScrollY - lastScrollY;
			toolbarTopOffset = Math.max(0, headerHeight - currentScrollY);
			if (shouldPinToolbar) {
				isSearchBarVisible = true;
				lastScrollY = currentScrollY;
				return;
			}

			if (currentScrollY <= 24) {
				isSearchBarVisible = true;
			} else if (delta > 6) {
				isSearchBarVisible = false;
				closeSuggestionUi();
			} else if (delta < -6) {
				isSearchBarVisible = true;
			}
			lastScrollY = currentScrollY;
		};

		window.addEventListener("pointerdown", closeOnOutside);
		window.addEventListener("keydown", closeOnEscape);
		window.addEventListener("keydown", handleShortcut);
		window.addEventListener("scroll", handleScroll, { passive: true });

		queueMicrotask(() => {
			syncSearchTextareaHeight();
		});

		return () => {
			clearApplyDebounce();
			window.removeEventListener("pointerdown", closeOnOutside);
			window.removeEventListener("keydown", closeOnEscape);
			window.removeEventListener("keydown", handleShortcut);
			window.removeEventListener("scroll", handleScroll);
		};
	});

	$effect(() => {
		if (filters.scope !== "notes" && isFilterMenuOpen) {
			isFilterMenuOpen = false;
		}
	});

	$effect(() => {
		void searchDraft;
		syncSearchTextareaHeight();
	});

	$effect(() => {
		if (shouldPinToolbar) {
			isSearchBarVisible = true;
		}
	});

	$effect(() => {
		if (!showSuggestions || typeof window === "undefined") {
			return;
		}

		void searchDraft;
		void filters.tags.length;
		updateSuggestionPosition();

		const handleViewportChange = () => {
			updateSuggestionPosition();
		};

		window.addEventListener("resize", handleViewportChange);
		window.addEventListener("scroll", handleViewportChange, { passive: true });

		let observer: ResizeObserver | null = null;
		if (searchFieldElement && typeof ResizeObserver !== "undefined") {
			observer = new ResizeObserver(handleViewportChange);
			observer.observe(searchFieldElement);
		}

		return () => {
			window.removeEventListener("resize", handleViewportChange);
			window.removeEventListener("scroll", handleViewportChange);
			observer?.disconnect();
		};
	});

	$effect(() => {
		if (!searchContainerElement) {
			return;
		}

		updateToolbarHeight();
		if (typeof ResizeObserver === "undefined") {
			return;
		}

		const observer = new ResizeObserver(() => {
			updateToolbarHeight();
		});
		observer.observe(searchContainerElement);
		return () => observer.disconnect();
	});

	$effect(() => {
		void showSuggestions;
		void visibleSuggestionCount;

		if (!showSuggestions) {
			activeSuggestionIndex = -1;
			return;
		}

		if (activeSuggestionIndex >= visibleSuggestionCount) {
			activeSuggestionIndex = visibleSuggestionCount - 1;
		}
	});
</script>

<div
	class={cn(
		"bg-surface border-border duration-base ease-entrance fixed inset-x-0 border-b transition-transform",
		isSidebarExpanded ? "md:left-70" : "md:left-12",
		isSearchBarVisible ? "translate-y-0" : "pointer-events-none -translate-y-full"
	)}
	style:top={`${toolbarTopOffset}px`}
	style:z-index="var(--z-nav)"
>
	<Container size="full" class="px-0 sm:px-0 lg:px-0">
		<div bind:this={searchContainerElement} class="px-3 py-1.5 md:px-5 md:py-2">
			<p class="sr-only" aria-live="polite" aria-atomic="true">{liveRegionMessage}</p>

			{#if hasKindFilterTokens}
				<div class="mb-1.5 flex flex-wrap items-center gap-1">
					{#each filters.kinds as kind (kind)}
						<button
							type="button"
							onclick={() => setKind("")}
							class="focus-ring bg-surface-elevated text-text hover:bg-surface-hover active:bg-surface-active inline-flex h-8 items-center gap-1 rounded-sm px-2 text-xs font-medium transition-colors"
						>
							<span
								>Tipo: {kindFilterOptions.find((option) => option.slug === kind)?.title ||
									kind}</span
							>
							<X class="h-3.5 w-3.5" />
						</button>
					{/each}
				</div>
			{/if}

			<div class="relative">
				<div class="bg-surface-elevated rounded-lg p-1">
					<label for="explore-search" class="sr-only">Buscar no explore</label>
					<div
						bind:this={searchFieldElement}
						class="bg-surface-elevated flex flex-wrap items-center gap-1 rounded-md px-2 py-1.5"
					>
						{#each filters.tags as tag (tag)}
							<button
								type="button"
								onmousedown={(event) => event.preventDefault()}
								onclick={() => removeTag(tag, { scrollToTop: false })}
								class="focus-ring bg-surface text-text hover:bg-surface-hover active:bg-surface-active inline-flex h-7 shrink-0 items-center gap-1 rounded-sm px-2 text-xs font-medium transition-colors"
								aria-label={`Remover tag ${tag}`}
							>
								<span>#{tag}</span>
								<X class="h-3.5 w-3.5" />
							</button>
						{/each}

						<textarea
							id="explore-search"
							bind:this={searchInputElement}
							bind:value={searchDraft}
							rows={1}
							role="combobox"
							aria-autocomplete="list"
							aria-haspopup="listbox"
							aria-controls={SUGGESTION_LISTBOX_ID}
							aria-expanded={showSuggestions}
							aria-activedescendant={activeSuggestionIndex >= 0
								? getSuggestionOptionId(activeSuggestionIndex)
								: undefined}
							autocomplete="off"
							onfocus={() => {
								isSearchFocused = true;
								isFilterMenuOpen = false;
							}}
							onblur={handleSearchBlur}
							onkeydown={handleSearchKeydown}
							oninput={handleSearchInput}
							placeholder="Pesquise por tema, título ou #tag"
							class="text-text placeholder:text-muted min-h-8 min-w-40 flex-1 resize-none border-none bg-transparent py-0.5 text-sm leading-5 focus:outline-none"
						></textarea>
					</div>

					<div class="mt-1 flex items-center gap-1">
						<div class="relative shrink-0">
							<button
								type="button"
								onclick={toggleFilterMenu}
								aria-expanded={isFilterMenuOpen}
								aria-label="Abrir filtros"
								class="focus-ring bg-surface text-text hover:bg-surface-hover active:bg-surface-active inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
							>
								<Plus size={14} strokeWidth={2} />
							</button>
							{#if advancedFilterCount > 0}
								<span
									class="bg-surface text-text pointer-events-none absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-sm px-1 text-[10px] font-medium"
								>
									{advancedFilterCount}
								</span>
							{/if}

							{#if isFilterMenuOpen}
								<div
									class="bg-surface-elevated absolute top-9 left-0 z-20 w-72 rounded-md p-2 shadow-lg sm:w-80"
									role="dialog"
									aria-label="Filtros avançados"
								>
									{#if filters.scope === "notes"}
										<div>
											<p class="text-muted tracking-caps mb-1 text-[10px] font-semibold uppercase">
												Tipo de nota
											</p>
											<div class="grid grid-cols-2 gap-1">
												{#each kindFilterOptions as option (option.slug)}
													<button
														type="button"
														onclick={() => setKind(option.slug)}
														class={cn(
															"focus-ring bg-surface text-muted hover:bg-surface-hover hover:text-text active:bg-surface-active inline-flex h-8 items-center justify-center rounded-md px-2 text-xs transition-colors",
															(option.slug === "" && filters.kinds.length === 0) ||
																filters.kinds[0] === option.slug
																? "bg-background text-text"
																: ""
														)}
													>
														{option.title}
													</button>
												{/each}
											</div>
										</div>

										<div class="mt-2 flex items-center justify-end">
											<button
												type="button"
												onclick={clearKindFilters}
												class="focus-ring text-muted hover:bg-surface-hover hover:text-text active:bg-surface-active inline-flex h-8 items-center justify-center rounded-sm px-2 text-xs transition-colors"
											>
												Limpar tipo
											</button>
										</div>
									{:else}
										<p class="text-muted text-xs">
											Filtros de tipo ficam disponíveis no escopo de notas.
										</p>
									{/if}
								</div>
							{/if}
						</div>

						<div class="scrollbar-none min-w-0 overflow-x-auto">
							<div
								role="tablist"
								aria-label="Escopo do explore"
								class="bg-surface-elevated inline-flex items-center gap-0.5 rounded-md p-0.5"
							>
								{#each EXPLORE_SCOPE_OPTIONS as option (option.value)}
									<button
										id={SCOPE_OPTION_IDS[option.value]}
										type="button"
										role="tab"
										aria-selected={filters.scope === option.value}
										aria-label={`${option.label}: ${scopeCounts[option.value]} itens`}
										onclick={() => selectScope(option.value)}
										onkeydown={(event) => handleScopeKeydown(event, option.value)}
										class={cn(
											"focus-ring text-muted hover:bg-surface-hover hover:text-text active:bg-surface-active inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-sm px-2.5 text-xs font-medium transition-colors",
											filters.scope === option.value ? "bg-surface text-text" : ""
										)}
									>
										<span aria-hidden="true">{getScopeEmoji(option.value)}</span>
										<span>{option.label}</span>
									</button>
								{/each}
							</div>
						</div>
					</div>
				</div>

				{#if showSuggestions}
					<div
						use:portalToBody
						bind:this={suggestionPanelElement}
						id={SUGGESTION_LISTBOX_ID}
						class="bg-surface-elevated fixed max-h-64 overflow-y-auto rounded-lg p-1.5 shadow-lg"
						role="listbox"
						aria-label="Sugestões de busca"
						style="top: {suggestionPosition.top}px; left: {suggestionPosition.left}px; width: {suggestionPosition.width}px; z-index: var(--z-nav);"
					>
						{#if hasTagSuggestionMode}
							{#if tagSuggestions.length > 0}
								{#each tagSuggestions as suggestion (suggestion.value)}
									{@const suggestionKey = `tag:${suggestion.value}`}
									{@const suggestionIndex = getSuggestionIndex(suggestionKey)}
									<button
										type="button"
										role="option"
										aria-selected={activeSuggestionIndex === suggestionIndex}
										id={getSuggestionOptionId(suggestionIndex)}
										onmouseenter={() => setActiveSuggestionByKey(suggestionKey)}
										onclick={() => applySuggestionByKey(suggestionKey)}
										class={cn(
											"focus-ring hover:bg-surface-hover active:bg-surface-active flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left transition-colors",
											activeSuggestionIndex === suggestionIndex ? "bg-surface" : ""
										)}
									>
										<span
											class="bg-surface text-text inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium"
										>
											#{suggestion.value}
										</span>
										<span class="text-muted text-[11px]">{suggestion.count}</span>
									</button>
								{/each}
							{:else}
								<div class="text-muted px-2 py-3 text-sm">
									Nenhuma tag encontrada para “#{activeTagQuery || ""}”.
								</div>
							{/if}
						{/if}

						{#if hasTagSuggestionMode}
							<div class="tracking-caps text-muted mt-1 px-2 pt-1 text-[10px] font-medium uppercase">
								↑↓ navegar tags · enter aplicar
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</Container>
</div>
<div style:height={`${toolbarHeight}px`} aria-hidden="true"></div>
