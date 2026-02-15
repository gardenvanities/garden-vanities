import type { BaseContent } from "$lib/shared/types";

export type ContentModule<T> = {
	metadata: T;
	default: unknown;
};

export interface LoadContentOptions<T> {
	filter?: (item: T) => boolean;
	sort?: (a: T, b: T) => number;
	slugFromPath?: (path: string) => string;
	typeFromPath?: (path: string) => string;
}

export function loadContent<T extends BaseContent>(
	modules: Record<string, ContentModule<T>>,
	options: LoadContentOptions<T> = {}
): T[] {
	const items: T[] = [];

	for (const path in modules) {
		if (path.includes("/_")) continue;

		const module = modules[path];
		const metadata = module.metadata;

		if (!metadata) continue;

		const item = { ...metadata };

		if (!item.slug && options.slugFromPath) {
			item.slug = options.slugFromPath(path);
		} else if (!item.slug) {
			const match = path.match(/\/([^/]+)\.md$/);
			if (match) item.slug = match[1];
		}

		if (options.typeFromPath) {
			if (!(item as Record<string, unknown>).type) {
				(item as Record<string, unknown>).type = options.typeFromPath(path);
			}
		}

		if (options.filter && !options.filter(item)) {
			continue;
		}

		items.push(item);
	}

	if (options.sort) {
		return items.sort(options.sort);
	}

	return items.sort((a, b) => {
		const dateA = a.updatedAt || a.publishedAt || a.createdAt;
		const dateB = b.updatedAt || b.publishedAt || b.createdAt;

		if (dateA && dateB) {
			return new Date(dateB).getTime() - new Date(dateA).getTime();
		}
		return a.title.localeCompare(b.title);
	});
}

