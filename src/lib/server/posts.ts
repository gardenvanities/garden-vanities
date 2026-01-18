import type { PostFrontmatter, Ripeness, Backlink, LinkReference } from "$lib/modules/posts/types";
import type { Component } from "svelte";

type MdsvexModule = {
	metadata: PostFrontmatter;
	default: Component;
};

const mdModules = import.meta.glob<MdsvexModule>("/src/content/posts/**/*.md", {
	eager: true
});

const rawModules = import.meta.glob("/src/content/posts/**/*.md", {
	query: "?raw",
	import: "default",
	eager: true
});

export async function getAllPosts(
	filter: { ripeness?: Ripeness[] } = {}
): Promise<PostFrontmatter[]> {
	const posts: PostFrontmatter[] = [];
	const seriesCounts = new Map<string, number>();

	for (const path in mdModules) {
		const module = mdModules[path];
		const metadata = module.metadata;

		if (!metadata) continue;

		if (!metadata.slug) {
			const match = path.match(/\/posts\/(.+)\.md$/);
			if (match) metadata.slug = match[1];
		}

		const allowedRipeness = filter.ripeness ?? ["fruit"];
		if (!allowedRipeness.includes(metadata.ripeness)) continue;

		posts.push(metadata);

		if (metadata.series?.name) {
			const name = metadata.series.name;
			seriesCounts.set(name, (seriesCounts.get(name) ?? 0) + 1);
		}
	}

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

function stripMarkdown(content: string): string {
	return content
		.replace(/---\n[\s\S]*?\n---/, "")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
		.replace(/[#*`_~]/g, "")
		.replace(/\n/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

export async function getAllPostsForSearch(): Promise<
	Array<PostFrontmatter & { content: string }>
> {
	const posts = await getAllPosts({ ripeness: ["fruit", "root"] });

	return Promise.all(
		posts.map(async (post) => {
			const raw = await getPostRawContent(post.slug);

			const content = raw ? stripMarkdown(raw) : post.summary || "";
			return { ...post, content };
		})
	);
}

export async function getPostBySlug(
	slug: string,
	allowSeed = false
): Promise<{ metadata: PostFrontmatter; component: Component } | null> {
	const allPosts = await getAllPosts({
		ripeness: allowSeed ? ["fruit", "root", "seed"] : ["fruit", "root"]
	});

	const postMetadata = allPosts.find((p) => p.slug === slug);
	if (!postMetadata) return null;

	for (const path in mdModules) {
		const module = mdModules[path];

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
	const allPosts = await getAllPosts({ ripeness: ["fruit", "root"] });
	const results: Backlink[] = [];

	for (const path in rawModules) {
		const content = rawModules[path] as string;
		const originSlugMatch = path.match(/\/posts\/(.+)\.md$/);
		if (!originSlugMatch) continue;

		const originSlug = originSlugMatch[1];

		if (originSlug === targetSlug) continue;

		const linkRegex = new RegExp(`\\[(.*?)\\]\\((?:/posts/)?${targetSlug}(?:\\)|#)`, "g");

		if (linkRegex.test(content)) {
			const post = allPosts.find((p) => p.slug === originSlug);

			if (post) {
				linkRegex.lastIndex = 0;
				const match = linkRegex.exec(content);
				let context = "";

				if (match) {
					const index = match.index;

					const start = Math.max(0, index - 80);
					const end = Math.min(content.length, index + match[0].length + 80);
					const rawSnippet = content.slice(start, end);

					context = rawSnippet.replace(/[\r\n]+/g, " ");

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
	const allPosts = await getAllPosts({ ripeness: ["fruit", "root"] });
	const results: LinkReference[] = [];

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
