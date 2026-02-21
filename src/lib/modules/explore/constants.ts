import type { ExploreFilters, ExploreScope } from "$lib/modules/explore/types";

export const EXPLORE_SCOPE_OPTIONS: Array<{ value: ExploreScope; label: string }> = [
	{ value: "notes", label: "Notas" },
	{ value: "series", label: "Séries" },
	{ value: "sets", label: "Sets" }
];

export const DEFAULT_EXPLORE_FILTERS: ExploreFilters = {
	text: "",
	tags: [],
	kinds: [],
	scope: "notes"
};
