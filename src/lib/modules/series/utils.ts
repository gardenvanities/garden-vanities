import type { PostFrontmatter, SerieNavigation } from "$lib/modules/posts/types";

export function computeSerieNavigation(
	currentPost: PostFrontmatter,
	allPosts: PostFrontmatter[]
): SerieNavigation | undefined {
	if (!currentPost.series) return undefined;

	const seriePosts = allPosts
		.filter((p) => p.series?.name === currentPost.series?.name && p.ripeness === "fruit")
		.sort((a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0));

	const currentIndex = seriePosts.findIndex((p) => p.slug === currentPost.slug);

	if (currentIndex === -1) return undefined;

	const prev = seriePosts[currentIndex - 1];
	const next = seriePosts[currentIndex + 1];

	return {
		total: seriePosts.length,
		current: currentIndex + 1,
		prev: prev ? { slug: prev.slug, title: prev.title } : undefined,
		next: next ? { slug: next.slug, title: next.title } : undefined
	};
}

export function getSeriePosts(serieName: string, allPosts: PostFrontmatter[]): PostFrontmatter[] {
	return allPosts
		.filter((p) => p.series?.name === serieName && p.ripeness === "fruit")
		.sort((a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0));
}
