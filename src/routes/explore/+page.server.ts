import { getAllPosts } from "$lib/server/posts";
import { getAllKinds } from "$lib/server/kinds";
import { setCacheHeaders } from "$lib/server/utils";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setCacheHeaders(setHeaders);

	const posts = await getAllPosts({
		ripeness: ["fruit"]
	});

	const kinds = getAllKinds();

	return {
		posts,
		kinds
	};
};
