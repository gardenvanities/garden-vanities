import { getPageBySlug } from "$lib/server/pages";
import { setCacheHeaders } from "$lib/server/utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setCacheHeaders(setHeaders);

	const page = getPageBySlug("activities");

	if (!page) {
		throw error(404, "Página não encontrada");
	}

	return {
		metadata: page.metadata
	};
};
