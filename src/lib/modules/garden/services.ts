import { getAllPosts } from "$lib/server/posts";
import { getAllSeries, getAllSets } from "$lib/server/collections";
import type { PostFrontmatter } from "$lib/modules/posts/types";

export async function getSetsList(posts?: PostFrontmatter[]) {
	
	const allPosts =
		posts ||
		(await getAllPosts({
			ripeness: ["fruit", "root"]
		}));

	const allSetsData = getAllSets();

	return allSetsData
		.map((set) => {
			const setPosts = allPosts.filter((p) => p.set === set.slug);
			const postCount = setPosts.length;
			const lastUpdated = setPosts.reduce((latest, post) => {
				const postDate = post.updatedAt || post.publishedAt || "";
				return postDate > latest ? postDate : latest;
			}, "");
			return {
				slug: set.slug,
				title: set.title,
				description: set.description,
				cover: set.cover,
				count: postCount,
				lastUpdated,
				href: `/sets/${encodeURIComponent(set.slug)}`
			};
		})
		.filter((s) => s.count > 0)
		.sort((a, b) => b.count - a.count);
}

export async function getSeriesList(posts?: PostFrontmatter[]) {
	
	const allPosts =
		posts ||
		(await getAllPosts({
			ripeness: ["fruit", "root", "seed"]
		}));

	const allSeriesData = getAllSeries({ status: ["ongoing", "completed"] });

	return allSeriesData
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
		.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
}

export async function getDashboardData() {
	const allPosts = await getAllPosts({
		ripeness: ["fruit", "root", "seed"]
	});

	const setsPosts = allPosts.filter((p) => p.ripeness !== "seed");

	const [sets, series] = await Promise.all([getSetsList(setsPosts), getSeriesList(allPosts)]);

	return {
		sets: sets.slice(0, 6),
		series: series.slice(0, 3)
	};
}
