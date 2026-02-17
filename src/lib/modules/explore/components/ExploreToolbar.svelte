<script lang="ts">
	import { EXPLORE_SORT_OPTIONS } from "$lib/modules/explore/constants";
	import { sanitizeTags } from "$lib/modules/explore/services";
	import type { ExploreFilters, ExploreKindOption, ExploreSortBy } from "$lib/modules/explore/types";
	import { cn } from "$lib/shared/merge-class";
	import { Hash, SlidersHorizontal, Tags, X } from "@lucide/svelte";

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

	let tagInput = $state("");

	function setSortBy(sortBy: ExploreSortBy) {
		filters = {
			...filters,
			sortBy,
			preset: "all"
		};
	}

	function toggleKind(kindSlug: string) {
		const isActive = filters.kinds.includes(kindSlug);
		filters = {
			...filters,
			kinds: isActive ? filters.kinds.filter((kind) => kind !== kindSlug) : [...filters.kinds, kindSlug],
			preset: "all"
		};
	}

	function addTag() {
		const tags = sanitizeTags(tagInput.split(/[\s,]+/));
		if (tags.length === 0) {
			return;
		}
		filters = {
			...filters,
			tags: Array.from(new Set([...filters.tags, ...tags])),
			preset: "all"
		};
		tagInput = "";
	}

	function removeTag(tag: string) {
		filters = {
			...filters,
			tags: filters.tags.filter((currentTag) => currentTag !== tag),
			preset: "all"
		};
	}
</script>

<div class={cn("rounded-lg border border-border bg-surface p-3", className)}>
	<div class="mb-3 flex items-center justify-between">
		<p class="text-xs font-semibold tracking-caps text-muted uppercase">Filtros</p>
		<div class="inline-flex items-center gap-1 rounded-full border border-border bg-surface-elevated px-2 py-0.5 text-xs text-muted">
			<SlidersHorizontal class="h-3 w-3" />
			<span>{resultCount}</span>
		</div>
	</div>

	<div class="space-y-2">
		<label for="explore-sort" class="text-xs font-semibold tracking-caps text-muted uppercase">Ordenação</label>
		<select
			id="explore-sort"
			value={filters.sortBy}
			onchange={(event) => setSortBy((event.currentTarget as HTMLSelectElement).value as ExploreSortBy)}
			class="focus-ring h-9 w-full rounded-md border border-border bg-surface-elevated px-3 text-sm text-text"
		>
			{#each EXPLORE_SORT_OPTIONS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>

	<div class="my-3 h-px bg-border"></div>

	<div class="space-y-2">
		<p class="text-xs font-semibold tracking-caps text-muted uppercase">Tipos</p>
		<div class="flex flex-wrap gap-1.5">
			{#each kindOptions as kind (kind.slug)}
				<button
					type="button"
					onclick={() => toggleKind(kind.slug)}
					class={cn(
						"inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
						filters.kinds.includes(kind.slug)
							? "border-border-vivid bg-surface-elevated text-text"
							: "border-border bg-surface text-muted hover:bg-surface-hover hover:text-text"
					)}
				>
					{kind.title}
				</button>
			{/each}
		</div>
	</div>

	<div class="my-3 h-px bg-border"></div>

	<div class="space-y-2">
		<p class="text-xs font-semibold tracking-caps text-muted uppercase">Tags</p>
		<div class="relative">
			<Hash class="pointer-events-none absolute top-2.5 left-2 h-3.5 w-3.5 text-muted" />
			<input
				type="text"
				bind:value={tagInput}
				onkeydown={(event) => {
					if (event.key === "Enter" || event.key === ",") {
						event.preventDefault();
						addTag();
					}
				}}
				placeholder="adicionar tag"
				class="focus-ring h-9 w-full rounded-md border border-border bg-surface-elevated py-1 pl-7 pr-2 text-sm"
			/>
		</div>

		{#if filters.tags.length > 0}
			<div class="flex flex-wrap gap-1.5">
				{#each filters.tags as tag (tag)}
					<button
						type="button"
						onclick={() => removeTag(tag)}
						class="inline-flex items-center gap-1 rounded-full border border-border bg-surface-elevated px-2 py-1 text-xs text-text hover:bg-surface-hover"
					>
						<Tags class="h-3 w-3" />
						<span>{tag}</span>
						<X class="h-3 w-3" />
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
