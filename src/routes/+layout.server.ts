import type { LayoutServerLoad } from "./$types";

// Search index is now lazy loaded via /api/search.json
export const load: LayoutServerLoad = async () => {
	return {};
};
