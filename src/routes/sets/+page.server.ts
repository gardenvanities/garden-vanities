import { getSetsList } from "$lib/modules/garden/services";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	// Get sorted and enriched sets from service
	const sortedSets = await getSetsList();

	return {
		sets: sortedSets
	};
};
