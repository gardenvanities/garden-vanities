import {
	getAllPosts,
	getPostBySlug,
	getBacklinks,
	getPostRawContent,
	getReferences
} from "$lib/server/posts";
import { computeSerieNavigation } from "$lib/utils/serie";
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

	const allPosts = await getAllPosts();
	const navigation = computeSerieNavigation(post.metadata, allPosts);
	const backlinks = await getBacklinks(params.slug);

	let references: import("$lib/types").LinkReference[] = [];
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
