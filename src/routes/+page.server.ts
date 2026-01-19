import { getAllPosts } from "$lib/server/posts";
import { getAllSeries, getAllSets } from "$lib/server/collections";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	const allPosts = await getAllPosts({
		ripeness: ["fruit", "root"]
	});

	// Get sets from dedicated content files and enrich with post counts
	const allSetsData = getAllSets();
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

	// Get series from dedicated content files and enrich with post counts
	const allSeriesData = getAllSeries({ status: ["ongoing", "completed"] });
	const series = allSeriesData
		.map((s) => {
			const seriesPosts = allPosts.filter((p) => p.series?.slug === s.slug);
			const postCount = seriesPosts.length;
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
};
