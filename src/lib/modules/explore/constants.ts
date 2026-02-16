import type { ExploreFilters, ExplorePreset, ExploreScope, ExploreSortBy } from "$lib/modules/explore/types";

export const EXPLORE_SCOPE_OPTIONS: Array<{ value: ExploreScope; label: string }> = [
	{ value: "all", label: "Notas + Séries" },
	{ value: "sets", label: "Coleções" }
];

export const EXPLORE_SORT_OPTIONS: Array<{ value: ExploreSortBy; label: string }> = [
	{ value: "newest", label: "Mais recentes" },
	{ value: "oldest", label: "Mais antigas" },
	{ value: "az", label: "De A a Z" }
];

export const EXPLORE_PRESETS: ExplorePreset[] = [
	{
		id: "all",
		label: "Tudo",
		description: "Visão geral do jardim",
		filters: { scope: "all", kinds: [], tags: [], sortBy: "newest" }
	},
	{
		id: "latest",
		label: "Recentes",
		description: "Conteúdos publicados recentemente",
		filters: { scope: "all", kinds: [], tags: [], sortBy: "newest" }
	},
	{
		id: "tutorials",
		label: "Tutoriais",
		description: "Conteúdos práticos",
		filters: { scope: "all", kinds: ["tutorial"], sortBy: "newest" }
	},
	{
		id: "essays",
		label: "Ensaios",
		description: "Textos longos e reflexivos",
		filters: { scope: "all", kinds: ["essay"], sortBy: "newest" }
	},
	{
		id: "thoughts",
		label: "Pensamentos",
		description: "Notas breves e ideias",
		filters: { scope: "all", kinds: ["thought"], sortBy: "newest" }
	},
	{
		id: "sets",
		label: "Coleções",
		description: "Conjuntos temáticos",
		filters: { scope: "sets", kinds: [], sortBy: "newest" }
	}
];

export const DEFAULT_EXPLORE_FILTERS: ExploreFilters = {
	text: "",
	tags: [],
	kinds: [],
	scope: "all",
	sortBy: "newest",
	preset: "all"
};
