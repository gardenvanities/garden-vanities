// src/lib/server/posts.ts

import type { PostFrontmatter, Visibility } from "$lib/types";
import type { Component } from "svelte";

type MdsvexModule = {
	metadata: PostFrontmatter;
	default: Component;
};

export async function getAllPosts(
	filter: { visibility?: Visibility[] } = {}
): Promise<PostFrontmatter[]> {
	const modules = import.meta.glob<MdsvexModule>("/src/content/posts/**/*.md", {
		eager: true
	});

	const posts: PostFrontmatter[] = [];
	const seriesCounts = new Map<string, number>();

	for (const path in modules) {
		const module = modules[path];
		const metadata = module.metadata;

		if (!metadata) continue;

		const allowedVisibility = filter.visibility ?? ["public"];
		if (!allowedVisibility.includes(metadata.visibility)) continue;

		posts.push(metadata);

		if (metadata.series?.name) {
			const name = metadata.series.name;
			seriesCounts.set(name, (seriesCounts.get(name) ?? 0) + 1);
		}
	}

	// Attach totals to series info
	for (const post of posts) {
		if (post.series?.name) {
			post.series.total = seriesCounts.get(post.series.name);
		}
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
	const allPosts = await getAllPosts({
		visibility: allowPrivate ? ["public", "unlisted", "private"] : ["public", "unlisted"]
	});

	const modules = import.meta.glob<MdsvexModule>("/src/content/posts/**/*.md", {
		eager: true
	});

	const postMetadata = allPosts.find((p) => p.slug === slug);
	if (!postMetadata) return null;

	for (const path in modules) {
		const module = modules[path];
		if (module.metadata?.slug === slug) {
			return {
				metadata: postMetadata,
				component: module.default
			};
		}
	}

	return null;
}
