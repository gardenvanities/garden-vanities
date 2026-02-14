import { getSeriesBySlug } from "$lib/server/collections";
import { getAllPosts } from "$lib/server/posts";
import { setCacheHeaders } from "$lib/server/utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const slug = params.slug;

	setCacheHeaders(setHeaders);

	
	const series = getSeriesBySlug(slug);

	if (!series) {
		error(404, "Série não encontrada");
	}

	
	const allPosts = await getAllPosts({ ripeness: ["root", "fruit", "seed"] });

	const seriesPosts = allPosts
		.filter((post) => post.series?.slug === slug)
		.sort((a, b) => (a.series?.order || 0) - (b.series?.order || 0));

	if (seriesPosts.length === 0 && series.status === "draft") {
		error(404, "Série não encontrada");
	}

	return {
		series,
		posts: seriesPosts
	};
};
