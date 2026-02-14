import { getSeriesList } from "$lib/modules/garden/services";
import { setCacheHeaders } from "$lib/server/utils";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setCacheHeaders(setHeaders);

	
	const sortedSeries = await getSeriesList();

	return {
		series: sortedSeries
	};
};
