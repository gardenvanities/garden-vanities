import { getAllPostsForSearch } from "$lib/server/posts";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ setHeaders }) => {
	// Cache the search index for 1 hour (client) and 1 day (CDN)
	// This makes subsequent searches instant without hitting the server hard
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
