import { DEFAULT_EXPLORE_FILTERS, EXPLORE_PRESETS } from "$lib/modules/explore/constants";
import type {
	ExploreFilters,
	ExploreKindOption,
	ExplorePresetId,
	ExploreScope,
	ExploreSortBy
} from "$lib/modules/explore/types";

function normalizeTokens(values: string[]): string[] {
	return Array.from(new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean)));
}

function parseSortBy(value: string | null): ExploreSortBy {
	if (value === "oldest" || value === "az" || value === "newest") {
		return value;
	}
	return DEFAULT_EXPLORE_FILTERS.sortBy;
}

function parseScope(value: string | null): ExploreScope {
	if (value === "sets" || value === "all") {
		return value;
	}
	return DEFAULT_EXPLORE_FILTERS.scope;
}

function parsePreset(value: string | null): ExplorePresetId {
	if (EXPLORE_PRESETS.some((preset) => preset.id === value)) {
		return value as ExplorePresetId;
	}
	return DEFAULT_EXPLORE_FILTERS.preset;
}

export function sanitizeKinds(kinds: string[], availableKinds: ExploreKindOption[]): string[] {
	const availableSet = new Set(availableKinds.map((kind) => kind.slug));
	return normalizeTokens(kinds).filter((kind) => availableSet.has(kind));
}

export function sanitizeTags(tags: string[]): string[] {
	return normalizeTokens(tags).map((tag) => tag.replace(/^#/, ""));
}

export function applyExplorePreset(
	presetId: ExplorePresetId,
	baseFilters: ExploreFilters,
	availableKinds: ExploreKindOption[]
): ExploreFilters {
	const preset = EXPLORE_PRESETS.find((item) => item.id === presetId);
	if (!preset) {
		return baseFilters;
	}

	const merged = {
		...baseFilters,
		...preset.filters,
		preset: preset.id
	};

	return {
		...merged,
		kinds: sanitizeKinds(merged.kinds, availableKinds),
		tags: sanitizeTags(merged.tags)
	};
}

export function buildExploreFiltersFromSearchParams(
	searchParams: URLSearchParams,
	availableKinds: ExploreKindOption[]
): ExploreFilters {
	const text = (searchParams.get("q") || "").trim();
	const tags = sanitizeTags((searchParams.get("tags") || "").split(","));
	const kinds = sanitizeKinds((searchParams.get("kinds") || "").split(","), availableKinds);
	const sortBy = parseSortBy(searchParams.get("sort"));
	const scope = parseScope(searchParams.get("scope"));
	const preset = parsePreset(searchParams.get("preset"));

	return {
		text,
		tags,
		kinds,
		scope,
		sortBy,
		preset
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
	if (filters.sortBy !== DEFAULT_EXPLORE_FILTERS.sortBy) {
		searchParams.set("sort", filters.sortBy);
	}
	if (filters.preset !== DEFAULT_EXPLORE_FILTERS.preset) {
		searchParams.set("preset", filters.preset);
	}

	return searchParams;
}

export function hasActiveFilters(filters: ExploreFilters): boolean {
	return (
		filters.text.length > 0 ||
		filters.tags.length > 0 ||
		filters.kinds.length > 0 ||
		filters.scope !== DEFAULT_EXPLORE_FILTERS.scope ||
		filters.sortBy !== DEFAULT_EXPLORE_FILTERS.sortBy ||
		filters.preset !== DEFAULT_EXPLORE_FILTERS.preset
	);
}
