import { getSetBySlug } from "$lib/server/collections";
import { getAllPosts } from "$lib/server/posts";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	const slug = decodeURIComponent(params.set);

	// Get set metadata from dedicated content file
	const set = getSetBySlug(slug);

	if (!set) {
		error(404, "Set não encontrado");
	}

	// Get all posts and filter by set slug
	const allPosts = await getAllPosts({ ripeness: ["fruit", "root", "seed"] });

	const posts = allPosts.filter((p) => p.set === slug);

	return {
		set,
		posts
	};
};
