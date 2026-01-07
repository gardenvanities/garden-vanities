import { getAllPosts } from "$lib/server/posts";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
	const posts = await getAllPosts();

	// Map to only essential data for the command palette search
	const searchIndex = posts.map((post) => ({
		title: post.title,
		slug: post.slug,
		kind: post.kind // useful for displaying icons
	}));

	return {
		searchIndex
	};
};
