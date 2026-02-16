export type ExploreSortBy = "newest" | "oldest" | "az";

export type ExplorePresetId =
	| "all"
	| "latest"
	| "tutorials"
	| "essays"
	| "thoughts"
	| "sets";

export type ExploreScope = "all" | "sets";

export interface ExploreFilters {
	text: string;
	tags: string[];
	kinds: string[];
	scope: ExploreScope;
	sortBy: ExploreSortBy;
	preset: ExplorePresetId;
}

export interface ExplorePreset {
	id: ExplorePresetId;
	label: string;
	description: string;
	filters: Partial<ExploreFilters>;
}

export interface ExploreKindOption {
	slug: string;
	title: string;
}
