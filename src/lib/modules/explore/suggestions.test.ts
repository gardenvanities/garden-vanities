import { describe, expect, it } from "vitest";

import { buildExploreSuggestionState } from "./suggestions";
import type { SearchSuggestion, TagSuggestion } from "./types";

const suggestionPoolByScope: Record<"notes" | "series" | "sets", SearchSuggestion[]> = {
	notes: [
		{
			id: "post:computacao-quantica",
			label: "Computacao Quantica para Meros Mortais",
			value: "Computacao Quantica para Meros Mortais",
			type: "note"
		},
		{
			id: "post:filosofia-pratica",
			label: "Filosofia Pratica",
			value: "Filosofia Pratica",
			type: "note"
		}
	],
	series: [
		{
			id: "series:filosofia-moderna",
			label: "Filosofia Moderna",
			value: "Filosofia Moderna",
			type: "series"
		}
	],
	sets: [
		{
			id: "set:ciencia",
			label: "Colecao Ciencia",
			value: "Colecao Ciencia",
			type: "set"
		}
	]
};

const tagOptions: TagSuggestion[] = [
	{ value: "fisica", count: 12 },
	{ value: "filosofia", count: 8 },
	{ value: "ficcao", count: 2 }
];

describe("explore suggestion state", () => {
	it("enters tag mode and returns tag-only navigable items", () => {
		const state = buildExploreSuggestionState({
			scope: "notes",
			searchDraft: "tema #fi",
			selectedTags: ["fisica"],
			recentSearches: [],
			suggestionPoolByScope,
			tagOptions
		});

		expect(state.mode).toBe("tag");
		expect(state.items.length).toBeGreaterThan(0);
		expect(state.items.every((item) => item.kind === "tag")).toBe(true);
		expect(state.items.map((item) => item.key)).toEqual(["tag:filosofia", "tag:ficcao"]);
	});

	it("returns deduplicated recent terms in idle mode", () => {
		const state = buildExploreSuggestionState({
			scope: "notes",
			searchDraft: "",
			selectedTags: [],
			recentSearches: ["  fisica  ", "FISICA", "filosofia"],
			suggestionPoolByScope,
			tagOptions
		});

		expect(state.mode).toBe("idle");
		expect(state.showRecentSearches).toBe(true);
		expect(state.items.map((item) => item.key)).toEqual(["recent:fisica", "recent:filosofia"]);
	});

	it("prioritizes scope-aligned text suggestions while keeping search action first", () => {
		const state = buildExploreSuggestionState({
			scope: "series",
			searchDraft: "filos",
			selectedTags: [],
			recentSearches: [],
			suggestionPoolByScope,
			tagOptions
		});

		expect(state.mode).toBe("query");
		expect(state.items[0]?.kind).toBe("search-action");

		const firstText = state.items.find((item) => item.kind === "text");
		expect(firstText?.kind).toBe("text");
		if (firstText?.kind === "text") {
			expect(firstText.suggestion.type).toBe("series");
			expect(firstText.suggestion.label).toBe("Filosofia Moderna");
		}
	});
});
