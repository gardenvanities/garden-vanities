import { getAllPosts } from "$lib/server/posts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	const allPosts = await getAllPosts({ ripeness: ["root", "fruit"] });

	const groups = new Map<string, number>();

	for (const post of allPosts) {
		if (post.moc) {
			groups.set(post.moc, (groups.get(post.moc) || 0) + 1);
		}
	}

	const topics = Array.from(groups.entries())
		.map(([name, count]) => ({
			name,
			count,
			href: `/topics/${encodeURIComponent(name)}`
		}))
		.sort((a, b) => b.count - a.count);

	return {
		topics
	};
};
