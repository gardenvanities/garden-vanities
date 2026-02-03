import type { ResourceType } from "$lib/modules/library/types";

// ─────────────────────────────────────────────────────────────────────────────
// Cache Control
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sets standard cache headers for public content.
 * Default: 1 hour browser cache, 24 hours CDN cache.
 */
export function setCacheHeaders(
	setHeaders: (headers: Record<string, string>) => void,
	maxAge = 3600,
	sMaxAge = 86400
) {
	setHeaders({
		"cache-control": `max-age=${maxAge}, s-maxage=${sMaxAge}`
	});
}

// ─────────────────────────────────────────────────────────────────────────────
// Resource Resolution
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maps a folder name (from URL params) to a ResourceType.
 */
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
