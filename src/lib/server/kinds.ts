import type { KindFrontmatter } from "$lib/modules/posts/types";
import { loadContent, type ContentModule } from "$lib/server/content";

type KindModule = ContentModule<KindFrontmatter>;

const kindModules = import.meta.glob<KindModule>("/src/content/kinds/*.md", {
	eager: true
});

export function getAllKinds(): KindFrontmatter[] {
	return loadContent(kindModules, {
		slugFromPath: (path) => path.match(/\/kinds\/(.+)\.md$/)?.[1] || "",
		sort: (a, b) => a.title.localeCompare(b.title)
	});
}

export function getKindBySlug(slug: string): KindFrontmatter | null {
	for (const path in kindModules) {
		const module = kindModules[path];
		const metadata = module.metadata;

		if (!metadata) continue;

		const pathSlug = path.match(/\/kinds\/(.+)\.md$/)?.[1];

		if (metadata.slug === slug || pathSlug === slug) {
			return {
				...metadata,
				slug: metadata.slug || pathSlug || slug
			};
		}
	}
	return null;
}
