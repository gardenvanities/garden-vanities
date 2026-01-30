import {
	getAllPosts,
	getPostBySlug,
	getBacklinks,
	getPostRawContent,
	getReferences
} from "$lib/server/posts";
import { getSetBySlug, getSeriesBySlug } from "$lib/server/collections";
import { computeSerieNavigation } from "$lib/modules/series/utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	const post = await getPostBySlug(params.slug);

	if (!post) {
		throw error(404, "Post não encontrado");
	}

	if (post.metadata.set) {
		const set = getSetBySlug(post.metadata.set);
		if (set) {
			post.metadata.setTitle = set.title;
		}
	}

	if (post.metadata.series?.slug) {
		const series = getSeriesBySlug(post.metadata.series.slug);
		if (series) {
			post.metadata.series.title = series.title;
		}
	}

	const allPosts = await getAllPosts({ ripeness: ["fruit", "root", "seed"] });
	const navigation = computeSerieNavigation(post.metadata, allPosts);
	console.log(`[Server] Navigation computed for ${params.slug}:`, navigation ? `Found ${navigation.list?.length} items` : "Undefined");

	const backlinks = await getBacklinks(params.slug);

	let references: import("$lib/modules/posts/types").LinkReference[] = [];
	const rawContent = await getPostRawContent(params.slug);
	if (rawContent) {
		references = await getReferences(rawContent);
	}

	return {
		metadata: post.metadata,
		navigation,
		backlinks,
		references
	};
};
