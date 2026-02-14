import type {
	Resource,
	ResourceType,
	ConsumptionStatus,
	ResourceFilter,
	ResourceStats
} from "$lib/modules/library/types";
import { loadContent, type ContentModule } from "$lib/server/content";





type LibraryModule = ContentModule<Resource>;


const libraryModules = import.meta.glob<LibraryModule>("/src/content/library/**/*.md", {
	eager: true
});





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





export function getAllResources(filter: ResourceFilter = {}): Resource[] {
	return loadContent(libraryModules, {
		slugFromPath: getSlugFromPath,
		typeFromPath: (path) => getTypeFromPath(path) || "",
		filter: (resource) => {
			if (filter.type && filter.type.length > 0 && !filter.type.includes(resource.type)) {
				return false;
			}

			if (filter.status && filter.status.length > 0 && !filter.status.includes(resource.status)) {
				return false;
			}

			if (filter.rating !== undefined && resource.rating !== filter.rating) {
				return false;
			}

			if (filter.tags && filter.tags.length > 0) {
				const resourceTags = resource.tags || [];
				if (!filter.tags.some((tag) => resourceTags.includes(tag))) {
					return false;
				}
			}

			if (filter.search) {
				const searchLower = filter.search.toLowerCase();
				const titleMatch = resource.title.toLowerCase().includes(searchLower);
				const summaryMatch = resource.summary?.toLowerCase().includes(searchLower);

				if (!titleMatch && !summaryMatch) {
					return false;
				}
			}

			return true;
		},
		sort: (a, b) => {
			const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
			const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();

			if (dateA !== dateB) {
				return dateB - dateA;
			}
			return a.title.localeCompare(b.title);
		}
	});
}





export function getResourcesByType(
	type: ResourceType,
	filter: Omit<ResourceFilter, "type"> = {}
): Resource[] {
	return getAllResources({ ...filter, type: [type] });
}





export function getResourceBySlug(type: ResourceType, slug: string): Resource | null {
	for (const path in libraryModules) {
		if (path.includes("/_")) continue;

		const pathType = getTypeFromPath(path);
		const pathSlug = getSlugFromPath(path);

		
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





export function getCurrentlyConsuming(): Resource[] {
	return getAllResources({ status: ["consuming"] });
}

export function getResourceQueue(): Resource[] {
	return getAllResources({ status: ["queued"] });
}

export function getCompletedResources(): Resource[] {
	return getAllResources({ status: ["completed"] });
}





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
		paper: 0,
		noble: 0,
		game: 0,
		podcast: 0,
		video: 0,
		course: 0,
		tool: 0
	};

	const byStatus: Record<ConsumptionStatus, number> = {
		queued: 0,
		consuming: 0,
		completed: 0,
		abandoned: 0,
		"to-read": 0,
		"to-watch": 0,
		"to-listen": 0,
		"to-play": 0,
		"in-progress": 0
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
