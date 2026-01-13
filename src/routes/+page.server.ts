import { getAllPosts } from "$lib/server/posts";
import type { PageServerLoad } from "./$types";
import type { PostFrontmatter } from "$lib/types";

// Helper to group posts by MOC
function groupByMOC(posts: PostFrontmatter[]): Map<string, PostFrontmatter[]> {
	const groups = new Map<string, PostFrontmatter[]>();

	for (const post of posts) {
		if (post.moc) {
			const existing = groups.get(post.moc) || [];
			existing.push(post);
			groups.set(post.moc, existing);
		}
	}

	return groups;
}

// Helper to group posts by series
function groupBySeries(posts: PostFrontmatter[]): Map<string, PostFrontmatter[]> {
	const groups = new Map<string, PostFrontmatter[]>();

	for (const post of posts) {
		if (post.series?.name) {
			const existing = groups.get(post.series.name) || [];
			existing.push(post);
			groups.set(post.series.name, existing);
		}
	}

	// Sort each series by order
	for (const [name, seriesPosts] of groups.entries()) {
		groups.set(
			name,
			seriesPosts.sort((a, b) => (a.series?.order || 0) - (b.series?.order || 0))
		);
	}

	return groups;
}

export const load: PageServerLoad = async ({ setHeaders }) => {
	// Cache for 1 hour in browser, 1 day in CDN
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	// Get all posts (all ripeness levels)
	const allPosts = await getAllPosts({
		ripeness: ["fruit", "root", "seed"]
	});

	// Section B: MOCs (Areas of Interest)
	const mocGroups = groupByMOC(allPosts);
	const mocs = Array.from(mocGroups.entries()).map(([name, posts]) => ({
		name,
		count: posts.length,
		href: `/topics/${encodeURIComponent(name)}`
	}));

	// Section C: Posts by Kind (Reading Paths)
	const postsByKind = {
		note: allPosts.filter((p) => p.kind === "note"),
		essay: allPosts.filter((p) => p.kind === "essay"),
		tutorial: allPosts.filter((p) => p.kind === "tutorial"),
		thought: allPosts.filter((p) => p.kind === "thought")
	};

	// Section D: Posts by Ripeness
	const postsByRipeness = {
		seed: allPosts.filter((p) => p.ripeness === "seed"),
		root: allPosts.filter((p) => p.ripeness === "root"),
		fruit: allPosts.filter((p) => p.ripeness === "fruit")
	};

	// Section E: Freshness (Recently Updated)
	const freshPosts = [...allPosts]
		.filter((p) => p.updatedAt)
		.sort((a, b) => {
			const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
			const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
			return dateB - dateA;
		})
		.slice(0, 5);

	// Section F: Series
	const seriesGroups = groupBySeries(allPosts);
	const series = Array.from(seriesGroups.entries()).map(([name, posts]) => ({
		name,
		posts
	}));

	return {
		mocs,
		postsByKind,
		postsByRipeness,
		freshPosts,
		series
	};
};
