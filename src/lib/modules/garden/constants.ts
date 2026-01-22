import type { CollectionStatus } from "$lib/modules/posts/collections";

export const STATUS_LABELS: Record<CollectionStatus, string> = {
	ongoing: "Em andamento",
	completed: "Completa",
	archived: "Arquivada",
	draft: "Rascunho"
};
