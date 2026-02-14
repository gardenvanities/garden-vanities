import { getAllResources, getResourceStats } from "$lib/server/library";
import { setCacheHeaders } from "$lib/server/utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { FOLDER_TO_TYPES, TYPE_LABELS_PLURAL } from "$lib/modules/library/types";

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setCacheHeaders(setHeaders);

	const { type: folder } = params;
	const types = FOLDER_TO_TYPES[folder];

	if (!types || types.length === 0) {
		throw error(404, {
			message: "Tipo de recurso não encontrado"
		});
	}

	const resources = getAllResources({ type: types });
	const stats = getResourceStats();

	
	const resourceType = types[0];
	const typeLabel = TYPE_LABELS_PLURAL[resourceType];

	return {
		resources,
		stats,
		resourceType,
		typeLabel,
		folder
	};
};
