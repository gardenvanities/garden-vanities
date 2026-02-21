import { sanitizeTags } from "$lib/modules/explore/services";
import type {
	ExploreScope,
	ExploreSuggestionType,
	SearchSuggestion,
	TagSuggestion
} from "$lib/modules/explore/types";

const HASH_TOKEN_PATTERN = /(^|\s)#[^\s#]*/g;
const COMMITTED_TAG_PATTERN = /(?:^|\s)#([^\s#]+)(?=\s)/g;
const ACTIVE_TAG_PATTERN = /(?:^|\s)#([^\s#]*)$/;
const ACTIVE_TAG_TOKEN_PATTERN = /(^|\s)#[^\s#]*$/;
const SPACE_PATTERN = /\s+/g;

const SUGGESTION_TYPE_LABELS: Record<ExploreSuggestionType, string> = {
	note: "Nota",
	series: "Série",
	set: "Set"
};

function damerauLevenshteinDistance(a: string, b: string, maxDistance: number): number {
	const aLength = a.length;
	const bLength = b.length;

	if (Math.abs(aLength - bLength) > maxDistance) {
		return maxDistance + 1;
	}

	let prevPrev = Array.from({ length: bLength + 1 }, () => 0);
	let prev = Array.from({ length: bLength + 1 }, (_, index) => index);
	let curr = Array.from({ length: bLength + 1 }, () => 0);

	for (let i = 1; i <= aLength; i += 1) {
		curr[0] = i;
		let rowMin = curr[0];

		for (let j = 1; j <= bLength; j += 1) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			let distance = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);

			if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
				distance = Math.min(distance, prevPrev[j - 2] + 1);
			}

			curr[j] = distance;
			if (distance < rowMin) {
				rowMin = distance;
			}
		}

		if (rowMin > maxDistance) {
			return maxDistance + 1;
		}

		[prevPrev, prev, curr] = [prev, curr, prevPrev];
	}

	return prev[bLength];
}

export function normalizeSearchValue(value: string): string {
	return value
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.replace(SPACE_PATTERN, " ")
		.trim();
}

export function normalizeSearchInput(value: string): string {
	return value.replace(SPACE_PATTERN, " ").trim();
}

export function tokenizeSearchValue(value: string): string[] {
	return normalizeSearchValue(value)
		.split(/\s+/)
		.map((term) => term.trim())
		.filter(Boolean);
}

export function stripHashTokens(value: string): string {
	return value.replace(HASH_TOKEN_PATTERN, " ").replace(SPACE_PATTERN, " ").trim();
}

export function consumeCommittedTags(value: string): { nextInput: string; tags: string[] } {
	const rawTags = Array.from(value.matchAll(COMMITTED_TAG_PATTERN), (match) => match[1]);
	const tags = sanitizeTags(rawTags);
	const nextInput = value
		.replace(COMMITTED_TAG_PATTERN, " ")
		.replace(SPACE_PATTERN, " ")
		.trimStart();
	return { nextInput, tags };
}

export function getActiveTagQuery(value: string): string | null {
	const match = value.match(ACTIVE_TAG_PATTERN);
	if (!match) {
		return null;
	}
	return match[1].toLowerCase();
}

export function clearActiveTagToken(value: string): string {
	if (!ACTIVE_TAG_TOKEN_PATTERN.test(value)) {
		return value;
	}
	return value.replace(ACTIVE_TAG_TOKEN_PATTERN, " ").replace(SPACE_PATTERN, " ").trimStart();
}

export function isFuzzyTokenMatch(token: string, normalizedText: string): boolean {
	if (!token) {
		return true;
	}

	if (normalizedText.includes(token)) {
		return true;
	}

	if (token.length <= 2) {
		return false;
	}

	const maxDistance = token.length >= 7 ? 2 : 1;
	const words = normalizedText.split(/\s+/).filter(Boolean);

	for (const word of words) {
		if (word.length > 2 && (word.includes(token) || token.includes(word))) {
			return true;
		}

		if (Math.abs(word.length - token.length) > maxDistance) {
			continue;
		}

		if (damerauLevenshteinDistance(token, word, maxDistance) <= maxDistance) {
			return true;
		}
	}

	return false;
}

export function buildTextSuggestions(
	query: string,
	suggestionPool: SearchSuggestion[],
	activeTagQuery: string | null,
	limit = 7
): SearchSuggestion[] {
	if (activeTagQuery !== null) {
		return [];
	}

	const cleanQuery = normalizeSearchValue(stripHashTokens(query));
	const queryTokens = tokenizeSearchValue(cleanQuery);
	if (!cleanQuery || queryTokens.length === 0) {
		return [];
	}

	const startsWith: SearchSuggestion[] = [];
	const includes: SearchSuggestion[] = [];
	const fuzzy: SearchSuggestion[] = [];

	for (const suggestion of suggestionPool) {
		const normalizedLabel = normalizeSearchValue(suggestion.label);
		if (normalizedLabel.startsWith(cleanQuery)) {
			startsWith.push(suggestion);
			continue;
		}

		if (normalizedLabel.includes(cleanQuery)) {
			includes.push(suggestion);
			continue;
		}

		if (queryTokens.every((token) => isFuzzyTokenMatch(token, normalizedLabel))) {
			fuzzy.push(suggestion);
		}
	}

	return [...startsWith, ...includes, ...fuzzy].slice(0, limit);
}

export function buildTagSuggestions(
	scope: ExploreScope,
	activeTagQuery: string | null,
	selectedTags: string[],
	tagOptions: TagSuggestion[],
	limit = 8
): TagSuggestion[] {
	if (scope !== "notes" || activeTagQuery === null) {
		return [];
	}

	const selectedTagSet = new Set(selectedTags.map((tag) => normalizeSearchValue(tag)));
	const startsWith: TagSuggestion[] = [];
	const includes: TagSuggestion[] = [];

	for (const option of tagOptions) {
		const normalizedTag = normalizeSearchValue(option.value);
		if (selectedTagSet.has(normalizedTag)) {
			continue;
		}

		if (!activeTagQuery) {
			startsWith.push(option);
			continue;
		}

		if (normalizedTag.startsWith(activeTagQuery)) {
			startsWith.push(option);
			continue;
		}

		if (normalizedTag.includes(activeTagQuery)) {
			includes.push(option);
		}
	}

	return [...startsWith, ...includes].slice(0, limit);
}

export function getSuggestionTypeLabel(type: ExploreSuggestionType): string {
	return SUGGESTION_TYPE_LABELS[type];
}
