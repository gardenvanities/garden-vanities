import type { CollectionStatus } from "$lib/modules/posts/collections";
import type { PostFrontmatter } from "$lib/modules/posts/types";
import type { ImageMetadata } from "$lib/shared/types";

export type ExploreScope = "notes" | "series" | "sets";

export interface ExploreFilters {
	text: string;
	tags: string[];
	kinds: string[];
	scope: ExploreScope;
}

export interface ExploreKindOption {
	slug: string;
	title: string;
}

export interface ExploreSeriesItem {
	slug: string;
	title: string;
	description?: string;
	cover?: ImageMetadata;
	status: CollectionStatus;
	postCount: number;
	lastUpdated: string;
}

export interface ExploreSetItem {
	slug: string;
	title: string;
	description?: string;
	count: number;
	href: string;
	cover?: ImageMetadata;
	lastUpdated?: string;
}

export type ExploreSuggestionType = "note" | "series" | "set";

export interface SearchSuggestion {
	id: string;
	label: string;
	value: string;
	type: ExploreSuggestionType;
}

export interface TagSuggestion {
	value: string;
	count: number;
}

export type ExploreItem =
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
