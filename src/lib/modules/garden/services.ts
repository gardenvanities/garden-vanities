import { getAllPosts } from "$lib/server/posts";
import { getAllSeries, getAllSets } from "$lib/server/collections";

export async function getDashboardData() {
	// 1. Fetch base data
	const allPosts = await getAllPosts({
		ripeness: ["fruit", "root"]
	});
	const allSetsData = getAllSets();
	const allSeriesData = getAllSeries({ status: ["ongoing", "completed"] });

	// 2. Enrich Sets with post counts
	const sets = allSetsData
		.map((set) => {
			const postCount = allPosts.filter((p) => p.set === set.slug).length;
			return {
				slug: set.slug,
				title: set.title,
				description: set.description,
				cover: set.cover,
				count: postCount,
				href: `/sets/${encodeURIComponent(set.slug)}`
			};
		})
		.filter((s) => s.count > 0)
		.sort((a, b) => b.count - a.count)
		.slice(0, 6);

	// 3. Enrich Series with stats (count & last updated)
	const series = allSeriesData
		.map((s) => {
			const seriesPosts = allPosts.filter((p) => p.series?.slug === s.slug);
			const postCount = seriesPosts.length;
			
			// Calculate last updated based on posts
			const lastUpdated = seriesPosts.reduce((latest, post) => {
				const postDate = post.updatedAt || post.publishedAt || "";
				return postDate > latest ? postDate : latest;
			}, "");

			return {
				slug: s.slug,
				title: s.title,
				description: s.description,
				cover: s.cover,
				status: s.status,
				postCount,
				lastUpdated
			};
		})
		.filter((s) => s.postCount > 0)
		.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
		.slice(0, 3);

	return {
		sets,
		series
	};
}
