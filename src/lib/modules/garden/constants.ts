import type { CollectionStatus } from "$lib/modules/posts/collections";

export const STATUS_LABELS: Record<CollectionStatus, string> = {
	ongoing: "Em andamento",
	completed: "Completa",
	archived: "Arquivada",
	draft: "Rascunho"
};

export const KIND_LABELS: Record<string, string> = {
	note: "Nota",
	essay: "Ensaio",
	tutorial: "Tutorial",
	thought: "Reflexão"
};

export const KIND_META: Record<
	string,
	{
		label: string;
		description: string;
		colorToken: `kind-${string}`;
	}
> = {
	note: {
		label: "Nota",
		description: "Notas rápidas, observações e ideias em estágio inicial.",
		colorToken: "kind-note"
	},
	essay: {
		label: "Ensaio",
		description: "Textos mais longos, estruturados e aprofundados sobre um tópico.",
		colorToken: "kind-essay"
	},
	tutorial: {
		label: "Tutorial",
		description: "Guias passo-a-passo e instruções técnicas.",
		colorToken: "kind-tutorial"
	},
	thought: {
		label: "Reflexão",
		description: "Pensamentos soltos, opiniões e diários de bordo.",
		colorToken: "kind-thought"
	}
};

export const RIPENESS_LABELS: Record<string, string> = {
	seed: "Semente",
	root: "Rascunho",
	fruit: "Maduro"
};

export function getKindLabel(kind: string): string {
	return KIND_META[kind]?.label || KIND_LABELS[kind] || kind.charAt(0).toUpperCase() + kind.slice(1);
}

export function getKindDescription(kind: string): string {
	return KIND_META[kind]?.description || "Tipo de conteúdo do jardim.";
}

export function getKindColorToken(kind: string): string {
	return KIND_META[kind]?.colorToken || "kind-note";
}

export function getRipenessLabel(ripeness: string): string {
	return RIPENESS_LABELS[ripeness] || ripeness;
}
