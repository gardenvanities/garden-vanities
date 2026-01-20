import { getResourceBySlug } from "$lib/server/library";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { ResourceType } from "$lib/modules/library/types";
import { TYPE_LABELS } from "$lib/modules/library/types";

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	const { type: folder, slug } = params;

	// Map folder name to resource type
	const typeMap: Record<string, ResourceType> = {
		books: "book",
		films: "film",
		"series-tv": "tv-series",
		music: "album",
		articles: "article",
		research: "paper"
	};

	const resourceType = typeMap[folder];

	if (!resourceType) {
		throw error(404, {
			message: "Tipo de recurso não encontrado"
		});
	}

	const resource = getResourceBySlug(resourceType, slug);

	if (!resource) {
		throw error(404, {
			message: "Recurso não encontrado"
		});
	}

	const typeLabel = TYPE_LABELS[resourceType];

	return {
		resource,
		resourceType,
		typeLabel,
		folder
	};
};
