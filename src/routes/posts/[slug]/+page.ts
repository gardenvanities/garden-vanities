import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ data, params }) => {
	try {
		const post = await import(`../../../content/posts/${params.slug}.md`);

		return {
			...data,
			content: post.default
		};
	} catch (e) {
		console.error(`Error loading post ${params.slug}:`, e);
		throw error(404, `Post não encontrado: ${params.slug}`);
	}
};
