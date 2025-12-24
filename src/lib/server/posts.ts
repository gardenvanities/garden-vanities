// src/lib/server/posts.ts

import type { PostFrontmatter, Visibility } from '$lib/types';
import type { Component } from 'svelte';

type MdsvexModule = {
	metadata: PostFrontmatter;
	default: Component;
};

export async function getAllPosts(
	filter: { visibility?: Visibility[] } = {}
): Promise<PostFrontmatter[]> {
	const modules = import.meta.glob<MdsvexModule>('/src/content/posts/**/*.md', {
		eager: true
	});

	const posts: PostFrontmatter[] = [];

	for (const path in modules) {
		const module = modules[path];
		const metadata = module.metadata;

		if (!metadata) continue;

		const allowedVisibility = filter.visibility ?? ['public'];
		if (!allowedVisibility.includes(metadata.visibility)) continue;

		posts.push(metadata);
	}

	return posts.sort((a, b) => {
		if (a.publishedAt && b.publishedAt) {
			return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
		}
		return a.title.localeCompare(b.title);
	});
}

export async function getPostBySlug(
	slug: string,
	allowPrivate = false
): Promise<{ metadata: PostFrontmatter; component: Component } | null> {
	const modules = import.meta.glob<MdsvexModule>('/src/content/posts/**/*.md', {
		eager: true
	});

	for (const path in modules) {
		const module = modules[path];

		if (!module.metadata || module.metadata.slug !== slug) continue;

		if (module.metadata.visibility === 'private' && !allowPrivate) {
			return null;
		}

		return {
			metadata: module.metadata,
			component: module.default
		};
	}

	return null;
}
