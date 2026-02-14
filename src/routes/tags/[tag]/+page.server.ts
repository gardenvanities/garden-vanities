import { getAllPosts } from "$lib/server/posts";
import { setCacheHeaders } from "$lib/server/utils";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setCacheHeaders(setHeaders);

	const tag = decodeURIComponent(params.tag).toLowerCase();
	const allPosts = await getAllPosts({ ripeness: ["fruit", "root", "seed"] });

	const posts = allPosts.filter((p) => p.tags?.some((t) => t.toLowerCase() === tag));

	return {
		tag,
		posts
	};
};
