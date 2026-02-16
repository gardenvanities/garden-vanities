<script lang="ts">
import { DEFAULT_EXPLORE_FILTERS, EXPLORE_PRESETS, EXPLORE_SORT_OPTIONS } from "$lib/modules/explore/constants";
	import {
		applyExplorePreset,
		hasActiveFilters,
		sanitizeKinds,
		sanitizeTags
	} from "$lib/modules/explore/services";
	import type { ExploreFilters, ExploreKindOption, ExplorePresetId } from "$lib/modules/explore/types";
	import { SlidersHorizontal, X } from "@lucide/svelte";

	interface Props {
		filters: ExploreFilters;
		kindOptions: ExploreKindOption[];
		resultCount: number;
	}

	let { filters = $bindable(DEFAULT_EXPLORE_FILTERS), kindOptions, resultCount }: Props = $props();

	let tagInput = $state("");
	let showAdvanced = $state(false);
	let normalizedKindOptions = $derived(
		kindOptions.map((kind) => ({ slug: kind.slug.toLowerCase(), title: kind.title }))
	);
	let hasFilters = $derived(hasActiveFilters(filters));
	let isSetsScope = $derived(filters.scope === "sets");

	function updateFilters(patch: Partial<ExploreFilters>) {
		filters = { ...filters, ...patch };
	}

	function setPreset(presetId: ExplorePresetId) {
		filters = applyExplorePreset(presetId, filters, normalizedKindOptions);
	}

	function toggleKind(kind: string) {
		const kinds = filters.kinds.includes(kind)
			? filters.kinds.filter((item) => item !== kind)
			: [...filters.kinds, kind];
		updateFilters({ kinds: sanitizeKinds(kinds, normalizedKindOptions), preset: "all" });
	}

	function addTag() {
		if (!tagInput.trim()) {
			return;
		}
		const tags = sanitizeTags([...filters.tags, ...tagInput.split(/[\s,]+/)]);
		tagInput = "";
		updateFilters({ tags, preset: "all" });
	}

	function removeTag(tag: string) {
		updateFilters({
			tags: filters.tags.filter((item) => item !== tag),
			preset: "all"
		});
	}

	function resetFilters() {
		filters = { ...DEFAULT_EXPLORE_FILTERS };
		tagInput = "";
		showAdvanced = false;
	}
</script>

<div class="bg-surface border-border flex flex-col gap-3 rounded-lg border p-3">
	<div class="flex items-center justify-between gap-2">
		<p class="text-muted-foreground text-xs">{resultCount} resultados</p>
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={() => {
					showAdvanced = !showAdvanced;
				}}
				class="bg-background border-border hover:bg-muted inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
			>
				<SlidersHorizontal class="h-3.5 w-3.5" />
				<span>Avançado</span>
			</button>
			{#if hasFilters}
				<button
					type="button"
					onclick={resetFilters}
					class="text-primary text-xs font-medium hover:underline"
				>
					Limpar
				</button>
			{/if}
		</div>
	</div>

	<div class="grid grid-cols-1 gap-2">
		<label class="flex flex-col gap-1">
			<span class="text-muted-foreground text-xs">Ordenação</span>
			<select
				value={filters.sortBy}
				onchange={(event) => {
					const target = event.currentTarget as HTMLSelectElement;
					updateFilters({ sortBy: target.value as ExploreFilters["sortBy"] });
				}}
				class="bg-background border-border h-9 rounded-md border px-2 text-xs"
			>
				{#each EXPLORE_SORT_OPTIONS as option (option.value)}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</label>
	</div>

	<div class="flex flex-wrap gap-1.5">
		{#each EXPLORE_PRESETS as preset (preset.id)}
			{#if !isSetsScope || preset.id === "all" || preset.id === "sets"}
			<button
				type="button"
				onclick={() => setPreset(preset.id)}
				class="rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors {filters.preset ===
				preset.id
					? 'bg-primary text-primary-foreground border-primary'
					: 'bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted'}"
				title={preset.description}
			>
				{preset.label}
			</button>
			{/if}
		{/each}
	</div>

	{#if !isSetsScope && (filters.tags.length > 0 || filters.kinds.length > 0)}
		<div class="flex flex-wrap gap-1.5">
			{#each filters.kinds as kind (kind)}
				<button
					type="button"
					onclick={() => toggleKind(kind)}
					class="bg-muted inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px]"
				>
					<span>{kind}</span>
					<X class="h-3 w-3" />
				</button>
			{/each}
			{#each filters.tags as tag (tag)}
				<button
					type="button"
					onclick={() => removeTag(tag)}
					class="bg-muted inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px]"
				>
					<span>#{tag}</span>
					<X class="h-3 w-3" />
				</button>
			{/each}
		</div>
	{/if}

	{#if showAdvanced && !isSetsScope}
		<div class="border-border flex flex-col gap-3 border-t pt-3">
			{#if normalizedKindOptions.length > 0}
				<div class="flex flex-col gap-1.5">
					<p class="text-muted-foreground text-xs">Tipos</p>
					<div class="flex flex-wrap gap-1.5">
						{#each normalizedKindOptions as kind (kind.slug)}
							<button
								type="button"
								onclick={() => toggleKind(kind.slug)}
								class="rounded-full border px-2 py-1 text-[11px] transition-colors {filters.kinds.includes(
									kind.slug
								)
									? 'bg-primary/10 text-primary border-primary/30'
									: 'bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted'}"
							>
								{kind.title}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<div class="flex flex-col gap-1.5">
				<label class="text-muted-foreground text-xs" for="explore-tag-input">Tags</label>
				<div class="flex gap-1.5">
					<input
						id="explore-tag-input"
						type="text"
						bind:value={tagInput}
						onkeydown={(event) => {
							if (event.key === "Enter" || event.key === ",") {
								event.preventDefault();
								addTag();
							}
						}}
						onblur={addTag}
						placeholder="filosofia, produtividade"
						class="bg-background border-border h-9 flex-1 rounded-md border px-2 text-xs"
					/>
					<button
						type="button"
						onclick={addTag}
						class="bg-background border-border hover:bg-muted rounded-md border px-2 text-xs"
					>
						Adicionar
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
