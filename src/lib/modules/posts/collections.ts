import type { ImageMetadata } from "$lib/shared/types";

export type CollectionStatus = "draft" | "ongoing" | "completed" | "archived";

export interface ResourceLink {
	title: string;
	url: string;
	type: "github" | "youtube" | "pdf" | "link";
	icon?: string;
}

export interface CollectionTheme {
	accentColor?: string;
	heroStyle?: "minimal" | "cover-focused";
}

type CoverImage = ImageMetadata;





export interface SeriesFrontmatter {
	slug: string;
	title: string;
	description: string;
	status: CollectionStatus;
	cover?: CoverImage;
	resources?: ResourceLink[];
	theme?: CollectionTheme;
	nextSuggestedSeries?: string[];
	publishedAt?: string;
	updatedAt?: string;
	set?: string; // Slug of the parent set
}

export interface SeriesMetadata extends SeriesFrontmatter {
	 
	postCount?: number;
	 
	content?: string;
}





export interface SetFrontmatter {
	slug: string;
	title: string;
	description: string;
	cover?: CoverImage;
	theme?: CollectionTheme;
	relatedSets?: string[];
}

export interface SetMetadata extends SetFrontmatter {
	/** Calculated count of posts in this set */
	postCount?: number;
	/** List of series belonging to this set */
	series?: SeriesMetadata[];
	/** Optional rendered content from the markdown body */
	content?: string;
}
