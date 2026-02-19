import type { ExploreFilters, ExplorePreset, ExploreScope } from "$lib/modules/explore/types";

export const EXPLORE_SCOPE_OPTIONS: Array<{ value: ExploreScope; label: string }> = [
	{ value: "notes", label: "Notas" },
	{ value: "series", label: "Séries" },
	{ value: "sets", label: "Sets" }
];

export const EXPLORE_PRESETS: ExplorePreset[] = [
	{
		id: "all",
		label: "Tudo",
		description: "Visão geral do jardim",
		filters: { scope: "notes", kinds: [], tags: [] }
	},
	{
		id: "latest",
		label: "Recentes",
		description: "Conteúdos publicados recentemente",
		filters: { scope: "notes", kinds: [], tags: [] }
	},
	{
		id: "tutorials",
		label: "Tutoriais",
		description: "Conteúdos práticos",
		filters: { scope: "notes", kinds: ["tutorial"] }
	},
	{
		id: "essays",
		label: "Ensaios",
		description: "Textos longos e reflexivos",
		filters: { scope: "notes", kinds: ["essay"] }
	},
	{
		id: "thoughts",
		label: "Pensamentos",
		description: "Notas breves e ideias",
		filters: { scope: "notes", kinds: ["thought"] }
	},
	{
		id: "sets",
		label: "Coleções",
		description: "Conjuntos temáticos",
		filters: { scope: "sets", kinds: [] }
	}
];

export const DEFAULT_EXPLORE_FILTERS: ExploreFilters = {
	text: "",
	tags: [],
	kinds: [],
	scope: "notes",
	preset: "all"
};
