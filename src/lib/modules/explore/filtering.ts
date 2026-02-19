import {
	isFuzzyTokenMatch,
	normalizeSearchValue,
	tokenizeSearchValue
} from "$lib/modules/explore/search";
import type {
	ExploreFilters,
	ExploreItem,
	ExploreScope,
	ExploreSeriesItem,
	ExploreSetItem,
	SearchSuggestion,
	TagSuggestion
} from "$lib/modules/explore/types";
import type { PostFrontmatter } from "$lib/modules/posts/types";

export interface ExplorePostSearchEntry {
	post: PostFrontmatter;
	searchText: string;
	normalizedKind: string | null;
	normalizedTags: Set<string>;
	sortDate: number;
}

export interface ExploreSeriesSearchEntry {
	serie: ExploreSeriesItem;
	searchText: string;
	sortDate: number;
}

export interface ExploreSetSearchEntry {
	set: ExploreSetItem;
	searchText: string;
	sortDate: number;
}

function parseSortDate(value: string | undefined): number {
	if (!value) {
		return 0;
	}

	const timestamp = new Date(value).getTime();
	return Number.isFinite(timestamp) ? timestamp : 0;
}

function hasAllRequiredTags(postTagSet: Set<string>, requiredTags: Set<string>): boolean {
	for (const tag of requiredTags) {
		if (!postTagSet.has(tag)) {
			return false;
		}
	}
	return true;
}

function matchesTokens(searchText: string, tokens: string[]): boolean {
	if (tokens.length === 0) {
		return true;
	}
	return tokens.every((token) => isFuzzyTokenMatch(token, searchText));
}

export function getStandalonePosts(
	posts: PostFrontmatter[],
	seriesItems: ExploreSeriesItem[]
): PostFrontmatter[] {
	const seriesSlugSet = new Set(seriesItems.map((serie) => serie.slug));
	return posts.filter((post) => !post.series?.slug || !seriesSlugSet.has(post.series.slug));
}

export function createPostSearchEntry(post: PostFrontmatter): ExplorePostSearchEntry {
	return {
		post,
		searchText: normalizeSearchValue(
			[post.title, post.subtitle, post.summary].filter(Boolean).join(" ")
		),
		normalizedKind: post.kind ? normalizeSearchValue(post.kind) : null,
		normalizedTags: new Set((post.tags || []).map((tag) => normalizeSearchValue(tag))),
		sortDate: parseSortDate(post.publishedAt || post.updatedAt)
	};
}

export function createSeriesSearchEntry(serie: ExploreSeriesItem): ExploreSeriesSearchEntry {
	return {
		serie,
		searchText: normalizeSearchValue([serie.title, serie.description].filter(Boolean).join(" ")),
		sortDate: parseSortDate(serie.lastUpdated)
	};
}

export function createSetSearchEntry(set: ExploreSetItem): ExploreSetSearchEntry {
	return {
		set,
		searchText: normalizeSearchValue([set.title, set.description].filter(Boolean).join(" ")),
		sortDate: parseSortDate(set.lastUpdated)
	};
}

export function buildTagOptions(posts: PostFrontmatter[]): TagSuggestion[] {
	const tagCounts = new Map<string, number>();

	for (const post of posts) {
		for (const tag of post.tags || []) {
			const normalizedTag = normalizeSearchValue(tag);
			if (!normalizedTag) {
				continue;
			}

			const currentCount = tagCounts.get(normalizedTag) || 0;
			tagCounts.set(normalizedTag, currentCount + 1);
		}
	}

	return Array.from(tagCounts.entries())
		.map(([value, count]) => ({ value, count }))
		.sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, "pt-BR"));
}

export function buildSuggestionPool(
	scope: ExploreScope,
	postEntries: ExplorePostSearchEntry[],
	seriesEntries: ExploreSeriesSearchEntry[],
	setEntries: ExploreSetSearchEntry[]
): SearchSuggestion[] {
	if (scope === "series") {
		return seriesEntries.map((entry) => ({
			id: `series:${entry.serie.slug}`,
			label: entry.serie.title,
			value: entry.serie.title,
			type: "series"
		}));
	}

	if (scope === "sets") {
		return setEntries.map((entry) => ({
			id: `set:${entry.set.slug}`,
			label: entry.set.title,
			value: entry.set.title,
			type: "set"
		}));
	}

	return postEntries.map((entry) => ({
		id: `post:${entry.post.slug}`,
		label: entry.post.title,
		value: entry.post.title,
		type: "note"
	}));
}

export function filterPostEntries(
	filters: ExploreFilters,
	postEntries: ExplorePostSearchEntry[]
): ExplorePostSearchEntry[] {
	if (filters.scope !== "notes") {
		return [];
	}

	const requiredKinds = new Set(filters.kinds.map((kind) => normalizeSearchValue(kind)));
	const requiredTags = new Set(filters.tags.map((tag) => normalizeSearchValue(tag)));
	const textTokens = tokenizeSearchValue(filters.text);

	return postEntries.filter((entry) => {
		if (requiredKinds.size > 0) {
			if (!entry.normalizedKind || !requiredKinds.has(entry.normalizedKind)) {
				return false;
			}
		}

		if (requiredTags.size > 0 && !hasAllRequiredTags(entry.normalizedTags, requiredTags)) {
			return false;
		}

		return matchesTokens(entry.searchText, textTokens);
	});
}

export function filterSeriesEntries(
	filters: ExploreFilters,
	seriesEntries: ExploreSeriesSearchEntry[]
): ExploreSeriesSearchEntry[] {
	if (filters.scope !== "series") {
		return [];
	}

	const textTokens = tokenizeSearchValue(filters.text);
	return seriesEntries.filter((entry) => matchesTokens(entry.searchText, textTokens));
}

export function filterSetEntries(
	filters: ExploreFilters,
	setEntries: ExploreSetSearchEntry[]
): ExploreSetSearchEntry[] {
	if (filters.scope !== "sets") {
		return [];
	}

	const textTokens = tokenizeSearchValue(filters.text);
	return setEntries.filter((entry) => matchesTokens(entry.searchText, textTokens));
}

export function buildExploreItems(
	filteredPostEntries: ExplorePostSearchEntry[],
	filteredSeriesEntries: ExploreSeriesSearchEntry[],
	filteredSetEntries: ExploreSetSearchEntry[]
): ExploreItem[] {
	const items: ExploreItem[] = [
		...filteredPostEntries.map((entry) => ({
			type: "post" as const,
			key: `post:${entry.post.slug}`,
			title: entry.post.title,
			sortDate: entry.sortDate,
			post: entry.post
		})),
		...filteredSeriesEntries.map((entry) => ({
			type: "series" as const,
			key: `series:${entry.serie.slug}`,
			title: entry.serie.title,
			sortDate: entry.sortDate,
			serie: entry.serie
		})),
		...filteredSetEntries.map((entry) => ({
			type: "set" as const,
			key: `set:${entry.set.slug}`,
			title: entry.set.title,
			sortDate: entry.sortDate,
			set: entry.set
		}))
	];

	return items.sort((a, b) => {
		if (a.sortDate !== b.sortDate) {
			return b.sortDate - a.sortDate;
		}
		return a.title.localeCompare(b.title, "pt-BR");
	});
}
