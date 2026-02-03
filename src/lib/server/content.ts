import type { BaseContent } from "$lib/shared/types";

/**
 * Generic module structure returned by import.meta.glob with eager: true
 */
export type ContentModule<T> = {
	metadata: T;
	default: unknown;
};

/**
 * Options for loading content
 */
export interface LoadContentOptions<T> {
	/**
	 * Filter function to include/exclude items
	 */
	filter?: (item: T) => boolean;
	/**
	 * Sort function (defaults to date descending)
	 */
	sort?: (a: T, b: T) => number;
	/**
	 * Helper to derive slug from path if not in metadata
	 */
	slugFromPath?: (path: string) => string;
	/**
	 * Helper to derive type from path if needed (for polymorphic collections like library)
	 */
	typeFromPath?: (path: string) => string;
}

/**
 * Loads and processes content from import.meta.glob results
 */
export function loadContent<T extends BaseContent>(
	modules: Record<string, ContentModule<T>>,
	options: LoadContentOptions<T> = {}
): T[] {
	const items: T[] = [];

	for (const path in modules) {
		// Skip private files/folders (starting with _)
		if (path.includes("/_")) continue;

		const module = modules[path];
		const metadata = module.metadata;

		if (!metadata) continue;

		const item = { ...metadata };

		// Derive slug from path if missing
		if (!item.slug && options.slugFromPath) {
			item.slug = options.slugFromPath(path);
		} else if (!item.slug) {
			// Fallback: extract filename
			const match = path.match(/\/([^/]+)\.md$/);
			if (match) item.slug = match[1];
		}

		// Derive type from path if needed (and supported by the type)
		if (options.typeFromPath) {
			if (!(item as Record<string, unknown>).type) {
				(item as Record<string, unknown>).type = options.typeFromPath(path);
			}
		}

		// Apply filter
		if (options.filter && !options.filter(item)) {
			continue;
		}

		items.push(item);
	}

	// Sort items
	if (options.sort) {
		return items.sort(options.sort);
	}

	// Default sort: publishedAt/createdAt descending, then title ascending
	return items.sort((a, b) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const dateA = a.updatedAt || (a as any).publishedAt || (a as any).createdAt;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const dateB = b.updatedAt || (b as any).publishedAt || (b as any).createdAt;

		if (dateA && dateB) {
			return new Date(dateB).getTime() - new Date(dateA).getTime();
		}
		return a.title.localeCompare(b.title);
	});
}
