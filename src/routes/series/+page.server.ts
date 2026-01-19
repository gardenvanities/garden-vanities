import { getAllSeries } from "$lib/server/collections";
import { getAllPosts } from "$lib/server/posts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	// Get series from dedicated content files (synchronous)
	const allSeries = getAllSeries({ status: ["ongoing", "completed"] });

	// Get all posts to count posts per series
	const allPosts = await getAllPosts({ ripeness: ["root", "fruit", "seed"] });

	// Enrich series with post counts and lastUpdated
	const enrichedSeries = allSeries.map((series) => {
		const seriesPosts = allPosts.filter(
			(post) => post.series?.slug === series.slug
		);

		const lastUpdated = seriesPosts.reduce((latest, post) => {
			const postDate = post.updatedAt || post.publishedAt || "";
			return postDate > latest ? postDate : latest;
		}, "");

		return {
			...series,
			postCount: seriesPosts.length,
			lastUpdated
		};
	});

	// Sort by lastUpdated descending
	const sortedSeries = enrichedSeries.sort((a, b) => {
		return (b.lastUpdated || "").localeCompare(a.lastUpdated || "");
	});

	return {
		series: sortedSeries
	};
};
