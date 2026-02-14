import type {
	SeriesFrontmatter,
	SeriesMetadata,
	SetFrontmatter,
	SetMetadata,
	CollectionStatus
} from "$lib/modules/posts/collections";





type SeriesMdModule = {
	metadata: SeriesFrontmatter;
	default: unknown;
};

const seriesModules = import.meta.glob<SeriesMdModule>("/src/content/series/**/*.md", {
	eager: true
});

export function getAllSeries(filter: { status?: CollectionStatus[] } = {}): SeriesMetadata[] {
	const series: SeriesMetadata[] = [];

	for (const path in seriesModules) {
		const module = seriesModules[path];
		const metadata = module.metadata;

		if (!metadata) continue;

		
		const pathMatch = path.match(/\/series\/(.+)\.md$/);
		const slug = metadata.slug || pathMatch?.[1] || "";

		
		const allowedStatus = filter.status ?? ["ongoing", "completed", "archived"];
		if (!allowedStatus.includes(metadata.status)) continue;

		series.push({
			...metadata,
			slug
		});
	}

	return series.sort((a, b) => {
		
		if (a.publishedAt && b.publishedAt) {
			return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
		}
		return a.title.localeCompare(b.title);
	});
}

export function getSeriesBySlug(slug: string): SeriesMetadata | null {
	for (const path in seriesModules) {
		const module = seriesModules[path];
		const metadata = module.metadata;

		if (!metadata) continue;

		const pathSlug = path.match(/\/series\/(.+)\.md$/)?.[1];

		if (metadata.slug === slug || pathSlug === slug) {
			return {
				...metadata,
				slug: metadata.slug || pathSlug || slug
			};
		}
	}

	return null;
}





type SetMdModule = {
	metadata: SetFrontmatter;
	default: unknown;
};

const setModules = import.meta.glob<SetMdModule>("/src/content/sets/**/*.md", {
	eager: true
});

export function getAllSets(): SetMetadata[] {
	const sets: SetMetadata[] = [];
	const allSeries = getAllSeries();

	for (const path in setModules) {
		const module = setModules[path];
		const metadata = module.metadata;

		if (!metadata) continue;

		// Extract slug from filename if not in metadata
		const pathMatch = path.match(/\/sets\/(.+)\.md$/);
		const slug = metadata.slug || pathMatch?.[1] || "";

		// Find series belonging to this set
		const setSeries = allSeries.filter((s) => s.set === slug);

		sets.push({
			...metadata,
			slug,
			series: setSeries
		});
	}

	return sets.sort((a, b) => a.title.localeCompare(b.title));
}

export function getSetBySlug(slug: string): SetMetadata | null {
	const allSeries = getAllSeries();

	for (const path in setModules) {
		const module = setModules[path];
		const metadata = module.metadata;

		if (!metadata) continue;

		const pathSlug = path.match(/\/sets\/(.+)\.md$/)?.[1];

		if (metadata.slug === slug || pathSlug === slug) {
			const finalSlug = metadata.slug || pathSlug || slug;
			const setSeries = allSeries.filter((s) => s.set === finalSlug);

			return {
				...metadata,
				slug: finalSlug,
				series: setSeries
			};
		}
	}

	return null;
}
