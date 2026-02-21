import { DEFAULT_EXPLORE_FILTERS } from "$lib/modules/explore/constants";
import type { ExploreFilters, ExploreKindOption, ExploreScope } from "$lib/modules/explore/types";

function normalizeTokens(values: string[]): string[] {
	return Array.from(new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean)));
}

function parseScope(value: string | null): ExploreScope {
	if (value === "notes" || value === "series" || value === "sets") {
		return value;
	}
	if (value === "all") {
		return "notes";
	}
	return DEFAULT_EXPLORE_FILTERS.scope;
}

export function sanitizeKinds(kinds: string[], availableKinds: ExploreKindOption[]): string[] {
	const availableSet = new Set(availableKinds.map((kind) => kind.slug));
	return normalizeTokens(kinds).filter((kind) => availableSet.has(kind));
}

export function sanitizeTags(tags: string[]): string[] {
	return normalizeTokens(tags).map((tag) => tag.replace(/^#/, ""));
}

export function buildExploreFiltersFromSearchParams(
	searchParams: URLSearchParams,
	availableKinds: ExploreKindOption[]
): ExploreFilters {
	const text = (searchParams.get("q") || "").trim();
	const tags = sanitizeTags((searchParams.get("tags") || "").split(","));
	const kinds = sanitizeKinds((searchParams.get("kinds") || "").split(","), availableKinds);
	const scope = parseScope(searchParams.get("scope"));

	return {
		text,
		tags: scope === "notes" ? tags : [],
		kinds: scope === "notes" ? kinds : [],
		scope
	};
}

export function buildExploreSearchParams(filters: ExploreFilters): URLSearchParams {
	const searchParams = new URLSearchParams();

	if (filters.text) {
		searchParams.set("q", filters.text);
	}
	if (filters.tags.length > 0) {
		searchParams.set("tags", filters.tags.join(","));
	}
	if (filters.kinds.length > 0) {
		searchParams.set("kinds", filters.kinds.join(","));
	}
	if (filters.scope !== DEFAULT_EXPLORE_FILTERS.scope) {
		searchParams.set("scope", filters.scope);
	}

	return searchParams;
}

export function hasActiveFilters(filters: ExploreFilters): boolean {
	return (
		filters.text.length > 0 ||
		filters.tags.length > 0 ||
		filters.kinds.length > 0 ||
		filters.scope !== DEFAULT_EXPLORE_FILTERS.scope
	);
}
