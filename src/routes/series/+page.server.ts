import { getSeriesList } from "$lib/modules/garden/services";
import type { PageServerLoad} from "./$types";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	// Get sorted and enriched series from service
	const sortedSeries = await getSeriesList();

	return {
		series: sortedSeries
	};
};

