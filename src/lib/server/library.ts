import type {
	Resource,
	ResourceType,
	ConsumptionStatus,
	ResourceFilter,
	ResourceStats
} from "$lib/modules/library/types";

// ─────────────────────────────────────────────────────────────────────────────
// Library Content Loading
// ─────────────────────────────────────────────────────────────────────────────

type LibraryMdModule = {
	metadata: Resource;
	default: unknown;
};

// Load all library content eagerly
const libraryModules = import.meta.glob<LibraryMdModule>("/src/content/library/**/*.md", {
	eager: true
});

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

function getTypeFromPath(path: string): ResourceType | null {
	const folderMatch = path.match(/\/library\/([^/]+)\//);
	if (!folderMatch) return null;

	const folder = folderMatch[1];
	const folderToType: Record<string, ResourceType> = {
		books: "book",
		films: "film",
		"series-tv": "tv-series",
		music: "album",
		articles: "article",
		research: "paper"
	};

	return folderToType[folder] || null;
}

function getSlugFromPath(path: string): string {
	const match = path.match(/\/library\/[^/]+\/(.+)\.md$/);
	return match?.[1] || "";
}

// ─────────────────────────────────────────────────────────────────────────────
// Get All Resources
// ─────────────────────────────────────────────────────────────────────────────

export function getAllResources(filter: ResourceFilter = {}): Resource[] {
	const resources: Resource[] = [];

	for (const path in libraryModules) {
		// Skip tracking files
		if (path.includes("/_")) continue;

		const module = libraryModules[path];
		const metadata = module.metadata;

		if (!metadata) continue;

		// Derive type and slug from path if not in metadata
		const type = metadata.type || getTypeFromPath(path);
		const slug = metadata.slug || getSlugFromPath(path);

		if (!type) continue;

		const resource: Resource = {
			...metadata,
			type,
			slug
		} as Resource;

		// Apply filters
		if (filter.type && filter.type.length > 0 && !filter.type.includes(type)) {
			continue;
		}

		if (filter.status && filter.status.length > 0 && !filter.status.includes(resource.status)) {
			continue;
		}

		if (filter.rating !== undefined && resource.rating !== filter.rating) {
			continue;
		}

		if (filter.tags && filter.tags.length > 0) {
			const resourceTags = resource.tags || [];
			if (!filter.tags.some((tag) => resourceTags.includes(tag))) {
				continue;
			}
		}

		if (filter.search) {
			const searchLower = filter.search.toLowerCase();
			const titleMatch = resource.title.toLowerCase().includes(searchLower);
			const summaryMatch = resource.summary?.toLowerCase().includes(searchLower);

			if (!titleMatch && !summaryMatch) {
				continue;
			}
		}

		resources.push(resource);
	}

	// Sort by createdAt descending (newest first)
	return resources.sort((a, b) => {
		if (a.createdAt && b.createdAt) {
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		}
		return a.title.localeCompare(b.title);
	});
}

// ─────────────────────────────────────────────────────────────────────────────
// Get Resources by Type
// ─────────────────────────────────────────────────────────────────────────────

export function getResourcesByType(
	type: ResourceType,
	filter: Omit<ResourceFilter, "type"> = {}
): Resource[] {
	return getAllResources({ ...filter, type: [type] });
}

// ─────────────────────────────────────────────────────────────────────────────
// Get Resource by Slug
// ─────────────────────────────────────────────────────────────────────────────

export function getResourceBySlug(type: ResourceType, slug: string): Resource | null {
	for (const path in libraryModules) {
		if (path.includes("/_")) continue;

		const pathType = getTypeFromPath(path);
		const pathSlug = getSlugFromPath(path);

		// Check both folder-based type and metadata type
		if ((pathType === type || libraryModules[path].metadata?.type === type) && pathSlug === slug) {
			const module = libraryModules[path];
			const metadata = module.metadata;

			if (!metadata) return null;

			return {
				...metadata,
				type: metadata.type || type,
				slug: metadata.slug || slug
			} as Resource;
		}
	}

	return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Get Resources by Status
// ─────────────────────────────────────────────────────────────────────────────

export function getCurrentlyConsuming(): Resource[] {
	return getAllResources({ status: ["consuming"] });
}

export function getResourceQueue(): Resource[] {
	return getAllResources({ status: ["queued"] });
}

export function getCompletedResources(): Resource[] {
	return getAllResources({ status: ["completed"] });
}

// ─────────────────────────────────────────────────────────────────────────────
// Statistics
// ─────────────────────────────────────────────────────────────────────────────

export function getResourceStats(): ResourceStats {
	const all = getAllResources();

	const byType: Record<ResourceType, number> = {
		book: 0,
		film: 0,
		"tv-series": 0,
		album: 0,
		track: 0,
		playlist: 0,
		article: 0,
		paper: 0
	};

	const byStatus: Record<ConsumptionStatus, number> = {
		queued: 0,
		consuming: 0,
		completed: 0,
		abandoned: 0
	};

	for (const resource of all) {
		byType[resource.type]++;
		byStatus[resource.status]++;
	}

	return {
		total: all.length,
		byType,
		byStatus,
		completed: byStatus.completed,
		inProgress: byStatus.consuming,
		queued: byStatus.queued
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Get All Available Types (for navigation)
// ─────────────────────────────────────────────────────────────────────────────

export function getAvailableTypes(): ResourceType[] {
	const stats = getResourceStats();
	const types: ResourceType[] = [];

	for (const [type, count] of Object.entries(stats.byType)) {
		if (count > 0) {
			types.push(type as ResourceType);
		}
	}

	return types;
}
