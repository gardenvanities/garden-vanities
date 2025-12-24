// src/lib/types/posts.ts

import type { Author } from './author';

export type Visibility = 'public' | 'unlisted' | 'private';
export type Ripeness = 'seed' | 'bud' | 'bloom';
export type Kind = 'note' | 'essay' | 'tutorial' | 'thought';

export interface CoverImage {
	url: string;
	alt: string;
	caption?: string;
}

export interface Serie {
	name: string;
	order: number;
}

export interface SEO {
	metaTitle?: string;
	metaDescription?: string;
}

export interface PostFrontmatter {
	slug: string;
	title: string;
	subtitle?: string;
	excerpt?: string;
	visibility: Visibility;
	cover?: CoverImage;
	kind?: Kind;
	ripeness: Ripeness;
	tags?: string[];
	serie?: Serie;
	author: string; // "@nick" format
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
  readingTime: number;
  readingTimeLabel: 'short' | 'medium' | 'long';
  canonicalUrl: string;
  tableOfContents: TOCItem[];
}

export interface SerieNavigation {
  total: number;
  current: number;
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}

// No seu arquivo posts.ts, altere a interface Post:
export interface Post extends Omit<PostFrontmatter, 'author'>, PostComputed {
    author: Author; // Aqui o autor já é o objeto processado, não apenas o nick
    content: string;
    serieNavigation?: SerieNavigation;
}
