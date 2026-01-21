import type { PostFrontmatter, SerieNavigation } from "$lib/modules/posts/types";

export function computeSerieNavigation(
	currentPost: PostFrontmatter,
	allPosts: PostFrontmatter[]
): SerieNavigation | undefined {
	if (!currentPost.series) return undefined;

	const seriePosts = allPosts
		.filter((p) => p.series?.slug === currentPost.series?.slug && p.ripeness === "fruit")
		.sort((a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0));

	const currentIndex = seriePosts.findIndex((p) => p.slug === currentPost.slug);

	if (currentIndex === -1) return undefined;

	const prev = seriePosts[currentIndex - 1];
	const next = seriePosts[currentIndex + 1];

	return {
		total: seriePosts.length,
		current: currentIndex + 1,
		prev: prev ? { slug: prev.slug, title: prev.title, order: prev.series?.order } : undefined,
		next: next ? { slug: next.slug, title: next.title, order: next.series?.order } : undefined
	};
}

export function getSeriePosts(serieSlug: string, allPosts: PostFrontmatter[]): PostFrontmatter[] {
	return allPosts
		.filter((p) => p.series?.slug === serieSlug && p.ripeness === "fruit")
		.sort((a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0));
}
