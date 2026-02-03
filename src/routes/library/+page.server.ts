import { getAllResources } from "$lib/server/library";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const resources = getAllResources();

	// Group resources by type for display
	const resourcesByType = resources.reduce(
		(acc, resource) => {
			if (!acc[resource.type]) {
				acc[resource.type] = [];
			}
			acc[resource.type].push(resource);
			return acc;
		},
		{} as Record<string, typeof resources>
	);

	return {
		resources,
		resourcesByType
	};
};
