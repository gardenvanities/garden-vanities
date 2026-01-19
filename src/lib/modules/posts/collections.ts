/**
 * Types for Series and Sets Collections
 *
 * Series: Ordered sequence of posts (e.g., a tutorial series)
 * Sets: Unordered collection of related posts (e.g., a topic area)
 */

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

export interface CoverImage {
	url: string;
	alt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Series Metadata (from src/content/series/*.md)
// ─────────────────────────────────────────────────────────────────────────────

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
}

export interface SeriesMetadata extends SeriesFrontmatter {
	/** Number of posts in this series */
	postCount?: number;
	/** Content body from the markdown file */
	content?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Set Metadata (from src/content/sets/*.md)
// ─────────────────────────────────────────────────────────────────────────────

export interface SetFrontmatter {
	slug: string;
	title: string;
	description: string;
	cover?: CoverImage;
	theme?: CollectionTheme;
	relatedSets?: string[];
}

export interface SetMetadata extends SetFrontmatter {
	/** Number of posts in this set */
	postCount?: number;
	/** Content body from the markdown file */
	content?: string;
}
