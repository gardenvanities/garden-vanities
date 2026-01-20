import type { Component } from "svelte";

// ─────────────────────────────────────────────────────────────────────────────
// Pages Loading (for /now, /uses, etc.)
// ─────────────────────────────────────────────────────────────────────────────

export type PageFrontmatter = {
	title: string;
	updatedAt?: string;
};

type PageMdModule = {
	metadata: PageFrontmatter;
	default: Component;
};

const pageModules = import.meta.glob<PageMdModule>("/src/content/pages/**/*.md", {
	eager: true
});

export function getPageBySlug(
	slug: string
): { metadata: PageFrontmatter; component: Component } | null {
	for (const path in pageModules) {
		const module = pageModules[path];
		const metadata = module.metadata;

		if (!metadata) continue;

		const pathSlug = path.match(/\/pages\/(.+)\.md$/)?.[1];

		if (pathSlug === slug) {
			return {
				metadata,
				component: module.default
			};
		}
	}

	return null;
}
