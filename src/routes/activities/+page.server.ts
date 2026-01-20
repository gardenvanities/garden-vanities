import { getPageBySlug } from "$lib/server/pages";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	const page = getPageBySlug("activities");

	if (!page) {
		throw error(404, "Página não encontrada");
	}

	return {
		metadata: page.metadata
	};
};

