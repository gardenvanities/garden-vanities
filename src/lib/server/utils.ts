import type { ResourceType } from "$lib/modules/library/types";





 
export function setCacheHeaders(
	setHeaders: (headers: Record<string, string>) => void,
	maxAge = 3600,
	sMaxAge = 86400
) {
	setHeaders({
		"cache-control": `max-age=${maxAge}, s-maxage=${sMaxAge}`
	});
}





 
export function resolveResourceType(folder: string): ResourceType | null {
	const typeMap: Record<string, ResourceType> = {
		books: "book",
		films: "film",
		"series-tv": "tv-series",
		music: "album",
		articles: "article",
		research: "paper"
	};

	return typeMap[folder] || null;
}
