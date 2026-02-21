import {
	buildTagSuggestions,
	buildTextSuggestions,
	getActiveTagQuery,
	normalizeSearchInput,
	normalizeSearchValue,
	stripHashTokens
} from "$lib/modules/explore/search";
import type {
	ExploreScope,
	ExploreSuggestionType,
	SearchSuggestion,
	TagSuggestion
} from "$lib/modules/explore/types";

export type ExploreSuggestionMode = "idle" | "query" | "tag";

export type ExploreNavigableSuggestionItem =
	| {
			kind: "search-action";
			key: "action:search";
			value: string;
	  }
	| {
			kind: "recent";
			key: `recent:${string}`;
			value: string;
	  }
	| {
			kind: "text";
			key: string;
			suggestion: SearchSuggestion;
	  }
	| {
			kind: "tag";
			key: `tag:${string}`;
			tag: TagSuggestion;
	  };

export interface ExploreSuggestionState {
	mode: ExploreSuggestionMode;
	normalizedQuery: string;
	activeTagQuery: string | null;
	showSearchActionSuggestion: boolean;
	showRecentSearches: boolean;
	tagSuggestions: TagSuggestion[];
	textSuggestions: SearchSuggestion[];
	groupedTextSuggestions: Record<ExploreSuggestionType, SearchSuggestion[]>;
	items: ExploreNavigableSuggestionItem[];
}

interface BuildExploreSuggestionStateInput {
	scope: ExploreScope;
	searchDraft: string;
	selectedTags: string[];
	recentSearches: string[];
	suggestionPoolByScope: Record<ExploreScope, SearchSuggestion[]>;
	tagOptions: TagSuggestion[];
	textSuggestionLimit?: number;
	tagSuggestionLimit?: number;
}

const SCOPE_POOL_ORDER: Record<ExploreScope, ExploreScope[]> = {
	notes: ["notes", "series", "sets"],
	series: ["series", "notes", "sets"],
	sets: ["sets", "notes", "series"]
};

function buildSuggestionPoolByScopePriority(
	scope: ExploreScope,
	suggestionPoolByScope: Record<ExploreScope, SearchSuggestion[]>
): SearchSuggestion[] {
	const order = SCOPE_POOL_ORDER[scope];
	return order.flatMap((scopeValue) => suggestionPoolByScope[scopeValue]);
}

function dedupeSuggestionsById(suggestions: SearchSuggestion[]): SearchSuggestion[] {
	const seen = new Set<string>();
	const deduped: SearchSuggestion[] = [];

	for (const suggestion of suggestions) {
		if (seen.has(suggestion.id)) {
			continue;
		}
		seen.add(suggestion.id);
		deduped.push(suggestion);
	}

	return deduped;
}

function dedupeRecentSearches(recentSearches: string[]): string[] {
	const seen = new Set<string>();
	const deduped: string[] = [];

	for (const term of recentSearches) {
		const compact = normalizeSearchInput(term);
		const normalized = normalizeSearchValue(compact);
		if (!normalized || seen.has(normalized)) {
			continue;
		}
		seen.add(normalized);
		deduped.push(compact);
	}

	return deduped;
}

function groupTextSuggestions(
	suggestions: SearchSuggestion[]
): Record<ExploreSuggestionType, SearchSuggestion[]> {
	const grouped: Record<ExploreSuggestionType, SearchSuggestion[]> = {
		note: [],
		series: [],
		set: []
	};

	for (const suggestion of suggestions) {
		grouped[suggestion.type].push(suggestion);
	}

	return grouped;
}

export function buildExploreSuggestionState(
	input: BuildExploreSuggestionStateInput
): ExploreSuggestionState {
	const {
		scope,
		searchDraft,
		selectedTags,
		recentSearches,
		suggestionPoolByScope,
		tagOptions,
		textSuggestionLimit = 8,
		tagSuggestionLimit = 8
	} = input;

	const activeTagQuery = scope === "notes" ? getActiveTagQuery(searchDraft) : null;
	const normalizedQuery = normalizeSearchInput(stripHashTokens(searchDraft));
	const mode: ExploreSuggestionMode =
		activeTagQuery !== null ? "tag" : normalizedQuery.length > 0 ? "query" : "idle";

	const textSuggestionPool = buildSuggestionPoolByScopePriority(scope, suggestionPoolByScope);
	const textSuggestions = dedupeSuggestionsById(
		buildTextSuggestions(searchDraft, textSuggestionPool, activeTagQuery, textSuggestionLimit)
	);
	const groupedTextSuggestions = groupTextSuggestions(textSuggestions);
	const tagSuggestions = buildTagSuggestions(
		scope,
		activeTagQuery,
		selectedTags,
		tagOptions,
		tagSuggestionLimit
	);

	const showSearchActionSuggestion = mode === "query";
	const showRecentSearches = mode === "idle" && recentSearches.length > 0;
	const dedupedRecentSearches = showRecentSearches ? dedupeRecentSearches(recentSearches) : [];
	const items: ExploreNavigableSuggestionItem[] = [];

	if (mode === "tag") {
		for (const tagSuggestion of tagSuggestions) {
			items.push({
				kind: "tag",
				key: `tag:${tagSuggestion.value}`,
				tag: tagSuggestion
			});
		}
	} else {
		if (showSearchActionSuggestion) {
			items.push({
				kind: "search-action",
				key: "action:search",
				value: normalizedQuery
			});
		}

		for (const term of dedupedRecentSearches) {
			items.push({
				kind: "recent",
				key: `recent:${term}`,
				value: term
			});
		}

		for (const suggestion of textSuggestions) {
			items.push({
				kind: "text",
				key: suggestion.id,
				suggestion
			});
		}
	}

	return {
		mode,
		normalizedQuery,
		activeTagQuery,
		showSearchActionSuggestion,
		showRecentSearches,
		tagSuggestions,
		textSuggestions,
		groupedTextSuggestions,
		items
	};
}
