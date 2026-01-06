import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ data, params }) => {
	try {
		// Import the post file to get the component
		const post = await import(`../../../content/posts/${params.slug}.md`);

		return {
			// Merge the enriched metadata from server with the component
			...data,
			content: post.default
		};
	} catch (e) {
		console.error(`Error loading post ${params.slug}:`, e);
		throw error(404, `Post não encontrado: ${params.slug}`);
	}
};
