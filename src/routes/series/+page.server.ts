import { getAllPosts } from "$lib/server/posts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	const allPosts = await getAllPosts({ ripeness: ["root", "fruit", "seed"] });

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

			const existing = seriesMap.get(name) || {
				name,
				slug,
				count: 0,
				lastUpdated: ""
			};

			existing.count++;

			const postDate = post.updatedAt || post.publishedAt || "";
			if (postDate > existing.lastUpdated) {
				existing.lastUpdated = postDate;
			}

			seriesMap.set(name, existing);
		}
	}

	const series = Array.from(seriesMap.values()).sort((a, b) => {
		return b.lastUpdated.localeCompare(a.lastUpdated);
	});

	return {
		series
	};
};
