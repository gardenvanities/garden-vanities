import { getAllPostsForSearch } from "$lib/server/posts";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
	const posts = await getAllPostsForSearch();

	// Map to only essential data for the command palette search
	const searchIndex = posts.map((post) => ({
		title: post.title,
		slug: post.slug,
		kind: post.kind, // useful for displaying icons
		tags: post.tags,
		content: post.content
	}));

	return {
		searchIndex
	};
};
