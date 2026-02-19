import { describe, expect, it } from "vitest";
import {
	buildTagSuggestions,
	buildTextSuggestions,
	clearActiveTagToken,
	consumeCommittedTags,
	getActiveTagQuery,
	isFuzzyTokenMatch,
	normalizeSearchInput,
	normalizeSearchValue,
	stripHashTokens
} from "./search";
import type { SearchSuggestion, TagSuggestion } from "./types";

const suggestionPool: SearchSuggestion[] = [
	{ id: "post:1", label: "Fisica Quantica", value: "Fisica Quantica", type: "note" },
	{ id: "series:1", label: "Filosofia Moderna", value: "Filosofia Moderna", type: "series" },
	{ id: "set:1", label: "Astronomia", value: "Astronomia", type: "set" }
];

const tagOptions: TagSuggestion[] = [
	{ value: "fisica", count: 12 },
	{ value: "filosofia", count: 8 },
	{ value: "astronomia", count: 3 }
];

describe("explore search utilities", () => {
	it("normalizes accents and spacing", () => {
		expect(normalizeSearchValue("  FÍSICA   Teórica ")).toBe("fisica teorica");
		expect(normalizeSearchInput("  fisica   teorica ")).toBe("fisica teorica");
	});

	it("extracts only committed hashtags", () => {
		const committed = consumeCommittedTags("tema #fisica #filosofia ");
		expect(committed.tags).toEqual(["fisica", "filosofia"]);
		expect(committed.nextInput.trim()).toBe("tema");

		const pending = consumeCommittedTags("tema #incompleto");
		expect(pending.tags).toEqual([]);
	});

	it("handles active tag token lifecycle", () => {
		expect(getActiveTagQuery("tema #fi")).toBe("fi");
		expect(getActiveTagQuery("tema #fi ")).toBeNull();
		expect(clearActiveTagToken("tema #fi")).toBe("tema ");
		expect(stripHashTokens("tema #fisica")).toBe("tema");
	});

	it("matches fuzzy tokens for minor typos", () => {
		expect(isFuzzyTokenMatch("quantca", "fisica quantica")).toBe(true);
		expect(isFuzzyTokenMatch("zzzzz", "fisica quantica")).toBe(false);
		expect(isFuzzyTokenMatch("modernidade", "ciencia aplicada e metodo")).toBe(false);
	});

	it("prioritizes text suggestions and blocks them during tag mode", () => {
		const suggestions = buildTextSuggestions("fisica", suggestionPool, null);
		expect(suggestions[0]?.label).toBe("Fisica Quantica");

		const tagModeSuggestions = buildTextSuggestions("fisica", suggestionPool, "fi");
		expect(tagModeSuggestions).toEqual([]);
	});

	it("filters tag suggestions by scope and selected tags", () => {
		const suggestions = buildTagSuggestions("notes", "fi", ["fisica"], tagOptions);
		expect(suggestions.map((item) => item.value)).toEqual(["filosofia"]);

		const blockedByScope = buildTagSuggestions("sets", "fi", [], tagOptions);
		expect(blockedByScope).toEqual([]);
	});
});
