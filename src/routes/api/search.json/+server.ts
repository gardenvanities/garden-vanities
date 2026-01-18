import { getAllPostsForSearch } from "$lib/server/posts";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	const posts = await getAllPostsForSearch();

	const searchIndex = posts.map((post) => ({
		title: post.title,
		slug: post.slug,
		kind: post.kind,
		tags: post.tags,
		content: post.content
	}));

	return json(searchIndex);
};
