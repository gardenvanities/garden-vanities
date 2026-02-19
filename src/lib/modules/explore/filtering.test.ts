import { describe, expect, it } from "vitest";
import {
	buildExploreItems,
	createPostSearchEntry,
	createSeriesSearchEntry,
	createSetSearchEntry,
	filterPostEntries,
	filterSeriesEntries,
	getStandalonePosts
} from "./filtering";
import type { ExploreFilters, ExploreSeriesItem, ExploreSetItem } from "$lib/modules/explore/types";
import type { PostFrontmatter } from "$lib/modules/posts/types";

const defaultFilters: ExploreFilters = {
	text: "",
	tags: [],
	kinds: [],
	scope: "notes",
	preset: "all"
};

const posts: PostFrontmatter[] = [
	{
		slug: "fisica-quantica",
		title: "Fisica Quantica",
		summary: "introducao ao tema",
		ripeness: "fruit",
		kind: "essay",
		tags: ["fisica", "ciencia"],
		publishedAt: "2025-01-10"
	},
	{
		slug: "filosofia-mente",
		title: "Filosofia da Mente",
		summary: "ensaio sobre consciencia",
		ripeness: "fruit",
		kind: "thought",
		tags: ["filosofia"],
		publishedAt: "2025-01-20",
		series: { slug: "serie-filosofia", order: 1 }
	},
	{
		slug: "jardim-pratico",
		title: "Jardim Pratico",
		summary: "guia de cultivo",
		ripeness: "fruit",
		kind: "tutorial",
		tags: ["jardim"],
		publishedAt: "2025-02-05"
	}
];

const seriesItems: ExploreSeriesItem[] = [
	{
		slug: "serie-filosofia",
		title: "Filosofia Moderna",
		description: "estudos sobre modernidade",
		status: "ongoing",
		postCount: 4,
		lastUpdated: "2025-03-01"
	},
	{
		slug: "serie-ciencia",
		title: "Ciencia Aplicada",
		description: "metodo e pratica",
		status: "completed",
		postCount: 3,
		lastUpdated: "2025-01-05"
	}
];

const setItems: ExploreSetItem[] = [
	{
		slug: "set-alpha",
		title: "Alpha",
		description: "colecao alpha",
		count: 2,
		href: "/sets/alpha",
		lastUpdated: "2025-03-01"
	}
];

describe("explore filtering", () => {
	it("keeps standalone posts only", () => {
		const standalone = getStandalonePosts(posts, seriesItems);
		expect(standalone.map((post) => post.slug)).toEqual(["fisica-quantica", "jardim-pratico"]);
	});

	it("filters post entries by text, kind and tags", () => {
		const entries = posts.map(createPostSearchEntry);
		const filters: ExploreFilters = {
			...defaultFilters,
			text: "quantca",
			tags: ["fisica"],
			kinds: ["essay"],
			scope: "notes"
		};

		const filtered = filterPostEntries(filters, entries);
		expect(filtered.map((entry) => entry.post.slug)).toEqual(["fisica-quantica"]);
	});

	it("filters series entries with fuzzy text", () => {
		const entries = seriesItems.map(createSeriesSearchEntry);
		const filters: ExploreFilters = {
			...defaultFilters,
			scope: "series",
			text: "modernidade"
		};

		const filtered = filterSeriesEntries(filters, entries);
		expect(filtered.map((entry) => entry.serie.slug)).toEqual(["serie-filosofia"]);
	});

	it("builds sorted explore items by date desc and title as tie-breaker", () => {
		const postEntries = [createPostSearchEntry(posts[2])];
		const seriesEntries = [createSeriesSearchEntry(seriesItems[0])];
		const setEntries = [createSetSearchEntry(setItems[0])];

		const items = buildExploreItems(postEntries, seriesEntries, setEntries);
		expect(items.map((item) => item.key)).toEqual([
			"set:set-alpha",
			"series:serie-filosofia",
			"post:jardim-pratico"
		]);
	});
});
