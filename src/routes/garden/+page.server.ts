import { getAllPosts } from "$lib/server/posts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, setHeaders }) => {
	// Cache for 1 hour in browser, 1 day in CDN
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	// Get filter params from URL
	const mocFilter = url.searchParams.get("moc");
	const tagFilter = url.searchParams.get("tag");
	const ripenessFilter = url.searchParams.get("ripeness");

	// Get all posts
	const allPosts = await getAllPosts({
		ripeness: ["fruit", "root", "seed"]
	});

	// Apply filters
	let filteredPosts = allPosts;

	if (mocFilter) {
		filteredPosts = filteredPosts.filter((p) => p.moc === mocFilter);
	}

	if (tagFilter) {
		filteredPosts = filteredPosts.filter((p) =>
			p.tags?.some((tag) => tag.toLowerCase() === tagFilter.toLowerCase())
		);
	}

	if (ripenessFilter) {
		filteredPosts = filteredPosts.filter((p) => p.ripeness === ripenessFilter);
	}

	// Get all unique MOCs for filter UI
	const allMocs = Array.from(new Set(allPosts.filter((p) => p.moc).map((p) => p.moc))).sort();

	// Get all unique tags for filter UI
	const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags || []))).sort();

	return {
		posts: filteredPosts,
		filters: {
			moc: mocFilter,
			tag: tagFilter,
			ripeness: ripenessFilter
		},
		availableFilters: {
			mocs: allMocs,
			tags: allTags
		}
	};
};
