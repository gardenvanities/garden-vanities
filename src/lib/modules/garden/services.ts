import { getAllPosts } from "$lib/server/posts";
import { getAllSeries, getAllSets } from "$lib/server/collections";
import type { PostFrontmatter } from "$lib/modules/posts/types";

export async function getSetsList(posts?: PostFrontmatter[]) {
	// If posts are not provided, fetch them (consistent with Sets page logic)
	const allPosts =
		posts ||
		(await getAllPosts({
			ripeness: ["fruit", "root"]
		}));

	const allSetsData = getAllSets();

	return allSetsData
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
		.sort((a, b) => b.count - a.count);
}

export async function getSeriesList(posts?: PostFrontmatter[]) {
	// If posts are not provided, fetch them (consistent with Series page logic which includes seeds)
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
		.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
}

export async function getDashboardData() {
	// Fetch all posts once to pass to both helpers (optimization)
	// We use the most inclusive filter ("seed") so Series calculation is correct.
	// Sets calculation filters by set property anyway, but getSetsList usually expects root/fruit.
	// However, passing "seed" posts to getSetsList won't hurt IF getSetsList filters them?
	// Actually, getSetsList logic above: `const postCount = allPosts.filter...`
	// If we pass seeds to getSetsList, it will count seeds in Sets.
	// The Sets page (Step 316) uses `ripeness: ["root", "fruit"]`.
	// If we want exact parity, we should fetch separately or filter.
	// Let's fetch separately to be safe and correct by default, or better:
	// We can fetch inclusive and let the helpers filter if they wanted?
	// The helpers uses the passed 'posts' as is.
	// So to be 100% correct without over-engineering:
	// Let's just let them fetch their own for now, or fetch inclusive and filter.

	// Optimization: Fetch inclusive, filter for sets.
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
