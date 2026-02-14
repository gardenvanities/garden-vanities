import { getAllPostsForSearch } from "$lib/server/posts";
import { getAllResources } from "$lib/server/library";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	const [posts, resources] = await Promise.all([getAllPostsForSearch(), getAllResources()]);

	const postItems = posts.map((post) => ({
		source: "post" as const,
		title: post.title,
		slug: post.slug,
		kind: post.kind,
		tags: post.tags,
		description: post.summary || "",
		content: post.content,
		date: post.updatedAt || post.publishedAt
	}));

	const resourceItems = resources.map((resource) => ({
		source: "resource" as const,
		title: resource.title,
		slug: resource.slug,
		libraryType: resource.type,
		tags: resource.tags,
		description: resource.summary || "",
		
		content: [
			resource.title,
			resource.summary,
			
			"author" in resource ? resource.author : "",
			"director" in resource ? resource.director : "",
			"creator" in resource ? resource.creator : "",
			"artist" in resource ? resource.artist : ""
		]
			.filter(Boolean)
			.join(" "),
		date: resource.updatedAt || resource.createdAt
	}));

	return json([...postItems, ...resourceItems]);
};
