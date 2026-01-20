import { getAllResources, getResourceStats, getCurrentlyConsuming } from "$lib/server/library";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	const resources = getAllResources();
	const stats = getResourceStats();
	const currentlyConsuming = getCurrentlyConsuming();

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
		stats,
		currentlyConsuming,
		resourcesByType
	};
};
