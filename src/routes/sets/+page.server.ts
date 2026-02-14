import { getSetsList } from "$lib/modules/garden/services";
import { setCacheHeaders } from "$lib/server/utils";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setCacheHeaders(setHeaders);

	
	const sortedSets = await getSetsList();

	return {
		sets: sortedSets
	};
};
