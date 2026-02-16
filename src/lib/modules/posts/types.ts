import type { Author } from "$lib/modules/author/types";
import type { BaseContent, ImageMetadata } from "$lib/shared/types";

export type Ripeness = "seed" | "root" | "fruit";
export type Kind = string;

export interface KindFrontmatter {
	slug: string;
	title: string;
	colorToken?: `kind-${string}`;
	description?: string;
}

export type CoverImage = ImageMetadata;

export interface Serie {
	slug: string;
	order: number;
	title?: string;
}

export interface SEO {
	title?: string;
	description?: string;
}

export interface PostFrontmatter extends BaseContent {
	ripeness: Ripeness;
	kind?: Kind;
	set?: string;
	setTitle?: string;
	series?: Serie;
	publishedAt?: string;
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
	prev?: { slug: string; title: string; order?: number };
	next?: { slug: string; title: string; order?: number };
	list: PostFrontmatter[];
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
