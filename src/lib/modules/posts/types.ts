import type { Author } from "$lib/modules/author/types";

export type Ripeness = "seed" | "root" | "fruit";
export type Kind = "note" | "essay" | "tutorial" | "thought";

export interface CoverImage {
	url: string;
	alt: string;
	caption?: string;
}

export interface Serie {
	slug: string;
	order: number;
}

export interface SEO {
	title?: string;
	description?: string;
}

export interface PostFrontmatter {
	slug: string;
	title: string;
	subtitle?: string;
	summary?: string;
	ripeness: Ripeness;
	kind?: Kind;
	set?: string;
	tags?: string[];
	cover?: CoverImage;
	series?: Serie;
	publishedAt?: string;
	updatedAt?: string;
	seo?: SEO;
}
export interface TOCItem {
	level: number;
	text: string;
	slug: string;
}

export interface PostComputed {
	readingTime?: number;
	readingTimeLabel?: "short" | "medium" | "long";
	canonicalUrl?: string;
	tableOfContents?: TOCItem[];
}

export interface SerieNavigation {
	total: number;
	current: number;
	prev?: { slug: string; title: string };
	next?: { slug: string; title: string };
}

export interface Backlink extends PostFrontmatter {
	context?: string;
}

export type LinkReference = PostFrontmatter;

export interface Post extends PostFrontmatter, PostComputed {
	author: Author;
	content: string;
	serieNavigation?: SerieNavigation;
	backlinks?: Backlink[];
	references?: LinkReference[];
}
