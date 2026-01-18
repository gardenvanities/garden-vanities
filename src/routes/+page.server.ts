import { getAllPosts } from "$lib/server/posts";
import type { PageServerLoad } from "./$types";
import type { PostFrontmatter } from "$lib/modules/posts/types";

function groupBySet(posts: PostFrontmatter[]): Map<string, PostFrontmatter[]> {
	const groups = new Map<string, PostFrontmatter[]>();

	for (const post of posts) {
		if (post.set) {
			const existing = groups.get(post.set) || [];
			existing.push(post);
			groups.set(post.set, existing);
		}
	}

	return groups;
}

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	const allPosts = await getAllPosts({
		ripeness: ["fruit", "root"]
	});

	const setGroups = groupBySet(allPosts);
	const sets = Array.from(setGroups.entries())
		.map(([name, posts]) => ({
			name,
			count: posts.length,
			href: `/sets/${encodeURIComponent(name)}`
		}))

		.sort((a, b) => b.count - a.count)

		.slice(0, 6);

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

	const freshPosts = [...allPosts]

		.sort((a, b) => {
			const dateA = new Date(a.updatedAt || a.publishedAt || 0).getTime();
			const dateB = new Date(b.updatedAt || b.publishedAt || 0).getTime();
			return dateB - dateA;
		})
		.slice(0, 6);

	return {
		sets,
		series,
		freshPosts
	};
};
