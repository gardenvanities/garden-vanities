import { getAllPosts } from "$lib/server/posts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	const posts = await getAllPosts({
		ripeness: ["seed", "root", "fruit"]
	});

	return {
		posts
	};
};
