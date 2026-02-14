import { getSetBySlug } from "$lib/server/collections";
import { getAllPosts } from "$lib/server/posts";
import { setCacheHeaders } from "$lib/server/utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setCacheHeaders(setHeaders);

	const slug = decodeURIComponent(params.set);

	
	const set = getSetBySlug(slug);

	if (!set) {
		error(404, "Set não encontrado");
	}

	
	const allPosts = await getAllPosts({ ripeness: ["fruit", "root", "seed"] });

	const posts = allPosts.filter((p) => p.set === slug);

	return {
		set,
		posts
	};
};
