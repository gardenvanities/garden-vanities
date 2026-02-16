import { getAllPosts } from "$lib/server/posts";
import { getAllKinds } from "$lib/server/kinds";
import { getSeriesList, getSetsList } from "$lib/modules/garden/services";
import { setCacheHeaders } from "$lib/server/utils";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setCacheHeaders(setHeaders);

	const posts = await getAllPosts({
		ripeness: ["fruit"]
	});
	const series = await getSeriesList(posts);
	const sets = await getSetsList(posts);

	const kinds = getAllKinds();

	return {
		posts,
		series,
		sets,
		kinds
	};
};
