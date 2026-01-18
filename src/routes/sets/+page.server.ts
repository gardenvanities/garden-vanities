import { getAllPosts } from "$lib/server/posts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	const allPosts = await getAllPosts({ ripeness: ["root", "fruit"] });

	const groups = new Map<string, number>();

	for (const post of allPosts) {
		if (post.set) {
			groups.set(post.set, (groups.get(post.set) || 0) + 1);
		}
	}

	const topics = Array.from(groups.entries())
		.map(([name, count]) => ({
			name,
			count,
			href: `/sets/${encodeURIComponent(name)}`
		}))
		.sort((a, b) => b.count - a.count);

	return {
		sets: topics
	};
};
