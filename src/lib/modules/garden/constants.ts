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

export const RIPENESS_LABELS: Record<string, string> = {
	seed: "Semente",
	root: "Rascunho",
	fruit: "Maduro"
};

export function getKindLabel(kind: string): string {
	return KIND_LABELS[kind] || kind.charAt(0).toUpperCase() + kind.slice(1);
}

export function getRipenessLabel(ripeness: string): string {
	return RIPENESS_LABELS[ripeness] || ripeness;
}
