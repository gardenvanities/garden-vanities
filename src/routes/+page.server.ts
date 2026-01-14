import { getAllPosts } from "$lib/server/posts";
import type { PageServerLoad } from "./$types";
import type { PostFrontmatter } from "$lib/types";

// Helper to group posts by MOC
function groupByMOC(posts: PostFrontmatter[]): Map<string, PostFrontmatter[]> {
	const groups = new Map<string, PostFrontmatter[]>();

	for (const post of posts) {
		if (post.moc) {
			const existing = groups.get(post.moc) || [];
			existing.push(post);
			groups.set(post.moc, existing);
		}
	}

	return groups;
}

export const load: PageServerLoad = async ({ setHeaders }) => {
	// Cache for 1 hour in browser, 1 day in CDN
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	// Get all posts (excluding seeds for Home Page)
	const allPosts = await getAllPosts({
		ripeness: ["fruit", "root"]
	});

	// Section B: MOCs (Areas of Interest)
	const mocGroups = groupByMOC(allPosts);
	const mocs = Array.from(mocGroups.entries())
		.map(([name, posts]) => ({
			name,
			count: posts.length,
			href: `/topics/${encodeURIComponent(name)}`
		}))
		// Sort by count descending
		.sort((a, b) => b.count - a.count)
		// Top 6 only
		.slice(0, 6);

	// Section C: Series (Top Collections)
	const seriesMap = new Map<
		string,
		{ name: string; slug: string; count: number; lastUpdated: string }
	>();

	for (const post of allPosts) {
		if (post.series?.name) {
			const name = post.series.name;
			const slug = name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-+|-+$/g, "");
			const existing = seriesMap.get(name) || { name, slug, count: 0, lastUpdated: "" };

			existing.count++;
			const postDate = post.updatedAt || post.publishedAt || "";
			if (postDate > existing.lastUpdated) {
				existing.lastUpdated = postDate;
			}
			seriesMap.set(name, existing);
		}
	}

	const series = Array.from(seriesMap.values())
		.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
		.slice(0, 3);

	// Section E: Activity Feed (Unified freshness)
	const freshPosts = [...allPosts]
		// Sort by latest activity (Updated OR Published)
		.sort((a, b) => {
			const dateA = new Date(a.updatedAt || a.publishedAt || 0).getTime();
			const dateB = new Date(b.updatedAt || b.publishedAt || 0).getTime();
			return dateB - dateA;
		})
		.slice(0, 6); // Top 6 active items

	return {
		mocs,
		series,
		freshPosts
	};
};
