import { getAllSets } from "$lib/server/collections";
import { getAllPosts } from "$lib/server/posts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	// Get sets from dedicated content files (synchronous)
	const allSets = getAllSets();

	// Get all posts to count posts per set
	const allPosts = await getAllPosts({ ripeness: ["root", "fruit"] });

	// Enrich sets with post counts
	const enrichedSets = allSets.map((set) => {
		const setPosts = allPosts.filter((post) => post.set === set.slug);
		return {
			...set,
			postCount: setPosts.length,
			href: `/sets/${encodeURIComponent(set.slug)}`
		};
	});

	// Sort by post count descending
	const sortedSets = enrichedSets.sort((a, b) => b.postCount - a.postCount);

	return {
		sets: sortedSets
	};
};
