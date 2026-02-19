<script lang="ts">
	import { EXPLORE_SORT_OPTIONS } from "$lib/modules/explore/constants";
	import type { ExploreFilters, ExploreKindOption, ExploreSortBy } from "$lib/modules/explore/types";
	import { cn } from "$lib/shared/merge-class";
	import { SlidersHorizontal } from "@lucide/svelte";

	interface Props {
		filters: ExploreFilters;
		kindOptions: ExploreKindOption[];
		resultCount: number;
		class?: string;
	}

	let {
		filters = $bindable(),
		kindOptions = [],
		resultCount = 0,
		class: className = ""
	}: Props = $props();

	function setSortBy(sortBy: ExploreSortBy) {
		filters = {
			...filters,
			sortBy,
			preset: "all"
		};
	}

	function setKind(kindSlug: string) {
		const nextKinds = kindSlug ? [kindSlug] : [];
		filters = {
			...filters,
			kinds: nextKinds,
			preset: "all"
		};
	}
</script>

<div class={cn("space-y-2", className)}>
	<div class="flex items-center justify-between">
		<p class="text-xs font-semibold tracking-caps text-muted uppercase">Filtros</p>
		<div class="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-muted">
			<SlidersHorizontal class="h-3 w-3" />
			<span>{resultCount}</span>
		</div>
	</div>

	<div class="space-y-1.5">
		<label for="explore-sort" class="text-xs font-semibold tracking-caps text-muted uppercase">Ordenação</label>
		<select
			id="explore-sort"
			value={filters.sortBy}
			onchange={(event) => setSortBy((event.currentTarget as HTMLSelectElement).value as ExploreSortBy)}
			class="focus-ring h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-text"
		>
			{#each EXPLORE_SORT_OPTIONS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>

	<div class="space-y-1.5">
		<p class="text-xs font-semibold tracking-caps text-muted uppercase">Tipos</p>
		<select
			value={filters.kinds[0] ?? ""}
			onchange={(event) => setKind((event.currentTarget as HTMLSelectElement).value)}
			class="focus-ring h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-text"
		>
			<option value="">Todos os tipos</option>
			{#each kindOptions as kind (kind.slug)}
				<option value={kind.slug}>{kind.title}</option>
			{/each}
		</select>
	</div>
</div>
