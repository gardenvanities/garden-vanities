import {
	getAllPosts,
	getPostBySlug,
	getBacklinks,
	getPostRawContent,
	getReferences
} from "$lib/server/posts";
import { getSetBySlug, getSeriesBySlug } from "$lib/server/collections";
import { getKindBySlug } from "$lib/server/kinds";
import { setCacheHeaders } from "$lib/server/utils";
import { computeSerieNavigation } from "$lib/modules/series/utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setCacheHeaders(setHeaders);

	const post = await getPostBySlug(params.slug);

	if (!post) {
		throw error(404, "Post não encontrado");
	}

	let kindDescription: string | undefined;
	let setDescription: string | undefined;
	let seriesDescription: string | undefined;

	if (post.metadata.kind) {
		const kind = getKindBySlug(post.metadata.kind);
		if (kind) {
			kindDescription = kind.description;
		}
	}

	if (post.metadata.set) {
		const set = getSetBySlug(post.metadata.set);
		if (set) {
			post.metadata.setTitle = set.title;
			setDescription = set.description;
		}
	}

	if (post.metadata.series?.slug) {
		const series = getSeriesBySlug(post.metadata.series.slug);
		if (series) {
			post.metadata.series.title = series.title;
			seriesDescription = series.description;
		}
	}

	const allPosts = await getAllPosts({ ripeness: ["fruit", "root", "seed"] });
	const navigation = computeSerieNavigation(post.metadata, allPosts);

	const backlinks = await getBacklinks(params.slug);

	let references: import("$lib/modules/posts/types").LinkReference[] = [];
	const rawContent = await getPostRawContent(params.slug);
	if (rawContent) {
		references = await getReferences(rawContent);
	}

	return {
		metadata: post.metadata,
		navigation,
		backlinks,
		references,
		kindDescription,
		setDescription,
		seriesDescription
	};
};
