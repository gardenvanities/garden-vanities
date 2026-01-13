import { getAllPosts } from "$lib/server/posts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	const tag = decodeURIComponent(params.tag).toLowerCase();
	const allPosts = await getAllPosts({ ripeness: ["fruit", "root", "seed"] });

	const posts = allPosts.filter((p) => 
		p.tags?.some(t => t.toLowerCase() === tag)
	);

	return {
		tag,
		posts
	};
};
