// src/lib/server/posts.ts
import type { PostFrontmatter, Visibility, Backlink, LinkReference } from "$lib/types";
import type { Component } from "svelte";

type MdsvexModule = {
	metadata: PostFrontmatter;
	default: Component;
};

// Eager load all markdown modules
const mdModules = import.meta.glob<MdsvexModule>("/src/content/posts/**/*.md", {
	eager: true
});

// Eager load all raw content for analysis
const rawModules = import.meta.glob("/src/content/posts/**/*.md", {
	query: "?raw",
	import: "default",
	eager: true
});

export async function getAllPosts(
	filter: { visibility?: Visibility[] } = {}
): Promise<PostFrontmatter[]> {
	const posts: PostFrontmatter[] = [];
	const seriesCounts = new Map<string, number>();

	for (const path in mdModules) {
		const module = mdModules[path];
		const metadata = module.metadata;

		if (!metadata) continue;

		// Ensure slug exists (fallback to filename if needed)
		if (!metadata.slug) {
			const match = path.match(/\/posts\/(.+)\.md$/);
			if (match) metadata.slug = match[1];
		}

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

	const postMetadata = allPosts.find((p) => p.slug === slug);
	if (!postMetadata) return null;

	for (const path in mdModules) {
		const module = mdModules[path];
		// Check metadata slug or filename slug
		const pathSlug = path.match(/\/posts\/(.+)\.md$/)?.[1];

		if (module.metadata?.slug === slug || pathSlug === slug) {
			return {
				metadata: postMetadata,
				component: module.default
			};
		}
	}

	return null;
}

export async function getPostRawContent(slug: string): Promise<string | null> {
	for (const path in rawModules) {
		const pathSlug = path.match(/\/posts\/(.+)\.md$/)?.[1];
		if (pathSlug === slug) {
			return rawModules[path] as string;
		}
	}
	return null;
}

export async function getBacklinks(targetSlug: string): Promise<Backlink[]> {
	const allPosts = await getAllPosts({ visibility: ["public", "unlisted"] });
	const results: Backlink[] = [];

	for (const path in rawModules) {
		const content = rawModules[path] as string;
		const originSlugMatch = path.match(/\/posts\/(.+)\.md$/);
		if (!originSlugMatch) continue;

		const originSlug = originSlugMatch[1];
		// Skip self-reference
		if (originSlug === targetSlug) continue;

		// Regex to find links to the target slug
		const linkRegex = new RegExp(`\\[(.*?)\\]\\((?:/posts/)?${targetSlug}(?:\\)|#)`, "g");

		if (linkRegex.test(content)) {
			const post = allPosts.find((p) => p.slug === originSlug);

			if (post) {
				// Extract context
				linkRegex.lastIndex = 0;
				const match = linkRegex.exec(content);
				let context = "";

				if (match) {
					const index = match.index;
					// Get ~100 chars around the link
					const start = Math.max(0, index - 80);
					const end = Math.min(content.length, index + match[0].length + 80);
					const rawSnippet = content.slice(start, end);

					// Clean up snippet
					context = rawSnippet.replace(/[\r\n]+/g, " ");
					// Strip markdown links [text](url) -> text
					context = context.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
					context = context.trim();
					context = "..." + context + "...";
				}

				results.push({
					...post,
					context
				});
			}
		}
	}

	return results;
}

export async function getReferences(originalContent: string): Promise<LinkReference[]> {
	const allPosts = await getAllPosts({ visibility: ["public", "unlisted"] });
	const results: LinkReference[] = [];

	// Regex to find markdown links: [Label](url)
	const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
	let match;
	const foundSlugs = new Set<string>();

	while ((match = regex.exec(originalContent)) !== null) {
		const url = match[2];

		let potentialSlug = url;

		if (url.startsWith("/")) {
			potentialSlug = url.replace(/^\/posts\//, "").replace(/^\//, "");
		} else if (url.startsWith("posts/")) {
			potentialSlug = url.replace(/^posts\//, "");
		}

		// Remove anchor tags if any
		potentialSlug = potentialSlug.split("#")[0];

		if (potentialSlug && !foundSlugs.has(potentialSlug)) {
			const post = allPosts.find((p) => p.slug === potentialSlug);
			if (post) {
				results.push(post);
				foundSlugs.add(potentialSlug);
			}
		}
	}

	return results;
}
