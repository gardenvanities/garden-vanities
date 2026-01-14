import { getAllPosts } from "$lib/server/posts";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// Simple slugify for matching (should match however you generate links)
function toSlug(str: string) {
	return str
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const slug = params.slug;

	const allPosts = await getAllPosts({ ripeness: ["root", "fruit", "seed"] });

	const seriesPosts = allPosts.filter((post) => {
		if (!post.series?.name) return false;
		return toSlug(post.series.name) === slug;
	});

	if (seriesPosts.length === 0) {
		error(404, "Série não encontrada");
	}

	// Sort by order
	seriesPosts.sort((a, b) => (a.series?.order || 0) - (b.series?.order || 0));

	const seriesName = seriesPosts[0].series?.name;

	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	return {
		seriesName,
		posts: seriesPosts
	};
};
