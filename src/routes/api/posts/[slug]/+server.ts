import { getPostBySlug } from "$lib/server/posts";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
	const { slug } = params;

	const post = await getPostBySlug(slug);

	if (!post) {
		return json({ error: "Post not found" }, { status: 404 });
	}

	return json({
		title: post.metadata.title,
		summary: post.metadata.summary,
		publishedAt: post.metadata.publishedAt,
		slug: post.metadata.slug,
		image: post.metadata.cover?.url
	});
};
