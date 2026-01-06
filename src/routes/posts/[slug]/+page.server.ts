import { getAllPosts, getPostBySlug } from "$lib/server/posts";
import { computeSerieNavigation } from "$lib/utils/serie";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPostBySlug(params.slug);

	if (!post) {
		throw error(404, "Post não encontrado");
	}

	const allPosts = await getAllPosts();
	const navigation = computeSerieNavigation(post.metadata, allPosts);

	return {
		metadata: post.metadata,
		navigation
	};
};
