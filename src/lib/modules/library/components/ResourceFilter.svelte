<script lang="ts">
	import type { ResourceType, ConsumptionStatus } from "$lib/modules/library/types";
	import { TYPE_LABELS, STATUS_LABELS } from "$lib/modules/library/types";
	import TypeIcon from "./TypeIcon.svelte";
	import { Search, X, SlidersHorizontal } from "@lucide/svelte";

	interface Props {
		selectedTypes: ResourceType[];
		selectedStatus: ConsumptionStatus[];
		searchQuery: string;
		availableTypes: ResourceType[];
		onTypeChange: (types: ResourceType[]) => void;
		onStatusChange: (status: ConsumptionStatus[]) => void;
		onSearchChange: (query: string) => void;
	}

	let {
		selectedTypes,
		selectedStatus,
		searchQuery,
		availableTypes,
		onTypeChange,
		onStatusChange,
		onSearchChange
	}: Props = $props();

	const allStatuses: ConsumptionStatus[] = ["queued", "consuming", "completed", "abandoned"];

	// Status colors
	const statusColors: Record<ConsumptionStatus, string> = {
		queued: "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",
		consuming: "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20",
		completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
		abandoned: "border-neutral-500/30 bg-neutral-500/10 text-neutral-400 hover:bg-neutral-500/20"
	};

	const statusSelectedColors: Record<ConsumptionStatus, string> = {
		queued: "border-amber-500 bg-amber-500/30 text-amber-300",
		consuming: "border-blue-500 bg-blue-500/30 text-blue-300",
		completed: "border-emerald-500 bg-emerald-500/30 text-emerald-300",
		abandoned: "border-neutral-400 bg-neutral-500/30 text-neutral-300"
	};

	function toggleType(type: ResourceType) {
		if (selectedTypes.includes(type)) {
			onTypeChange(selectedTypes.filter((t) => t !== type));
		} else {
			onTypeChange([...selectedTypes, type]);
		}
	}

	function toggleStatus(status: ConsumptionStatus) {
		if (selectedStatus.includes(status)) {
			onStatusChange(selectedStatus.filter((s) => s !== status));
		} else {
			onStatusChange([...selectedStatus, status]);
		}
	}

	function clearFilters() {
		onTypeChange([]);
		onStatusChange([]);
		onSearchChange("");
	}

	const hasActiveFilters = $derived(
		selectedTypes.length > 0 || selectedStatus.length > 0 || searchQuery.length > 0
	);

	const activeFilterCount = $derived(selectedTypes.length + selectedStatus.length);

	let showFilters = $state(false);
</script>

<div class="space-y-4">
	<!-- Search Bar -->
	<div class="flex gap-3">
		<div class="relative flex-1">
			<Search
				class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 transition-colors"
			/>
			<input
				type="text"
				placeholder="Buscar por título, autor, resumo..."
				value={searchQuery}
				oninput={(e) => onSearchChange(e.currentTarget.value)}
				class="w-full rounded-xl border border-white/6 bg-white/2 py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 focus:border-brand-500/50 focus:bg-white/4 focus:ring-2 focus:ring-brand-500/20"
			/>
			{#if searchQuery}
				<button
					type="button"
					onclick={() => onSearchChange("")}
					class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
				>
					<X class="h-4 w-4" />
				</button>
			{/if}
		</div>

		<!-- Filter Toggle Button (mobile) -->
		<button
			type="button"
			onclick={() => (showFilters = !showFilters)}
			class="flex items-center gap-2 rounded-xl border border-white/6 bg-white/2 px-4 py-3 text-sm text-white/70 transition-all hover:border-white/10 hover:bg-white/4 md:hidden {showFilters
				? 'border-brand-500/50 bg-brand-500/10 text-brand-400'
				: ''}"
		>
			<SlidersHorizontal class="h-4 w-4" />
			{#if activeFilterCount > 0}
				<span class="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-xs font-medium text-white">
					{activeFilterCount}
				</span>
			{/if}
		</button>
	</div>

	<!-- Filters (always visible on desktop, toggleable on mobile) -->
	<div class="hidden flex-col gap-4 md:flex {showFilters ? 'flex!' : ''}">
		<!-- Type Filters -->
		{#if availableTypes.length > 0}
			<div class="flex flex-wrap items-center gap-2">
				<span class="text-xs font-medium uppercase tracking-wider text-white/30">Tipo</span>
				<div class="mx-1 h-4 w-px bg-white/10"></div>
				{#each availableTypes as type}
					<button
						onclick={() => toggleType(type)}
						class="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 {selectedTypes.includes(
							type
						)
							? 'border-brand-500 bg-brand-500/20 text-brand-300 shadow-sm shadow-brand-500/20'
							: 'border-white/6 bg-white/2 text-white/60 hover:border-white/10 hover:bg-white/4 hover:text-white/80'}"
					>
						<TypeIcon {type} class="h-3.5 w-3.5" />
						<span>{TYPE_LABELS[type]}</span>
					</button>
				{/each}
			</div>
		{/if}

		<!-- Status Filters -->
		<div class="flex flex-wrap items-center gap-2">
			<span class="text-xs font-medium uppercase tracking-wider text-white/30">Status</span>
			<div class="mx-1 h-4 w-px bg-white/10"></div>
			{#each allStatuses as status}
				<button
					onclick={() => toggleStatus(status)}
					class="rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 {selectedStatus.includes(
						status
					)
						? statusSelectedColors[status]
						: statusColors[status]}"
				>
					{STATUS_LABELS[status]}
				</button>
			{/each}
		</div>

		<!-- Active Filters & Clear -->
		{#if hasActiveFilters}
			<div class="flex items-center gap-2 border-t border-white/6 pt-4">
				<span class="text-xs text-white/40">
					{#if searchQuery}
						Buscando "{searchQuery}"
					{/if}
					{#if activeFilterCount > 0}
						{#if searchQuery} · {/if}
						{activeFilterCount} filtro{activeFilterCount !== 1 ? "s" : ""} ativo{activeFilterCount !== 1 ? "s" : ""}
					{/if}
				</span>
				<button
					onclick={clearFilters}
					class="ml-auto flex items-center gap-1.5 rounded-lg border border-white/6 bg-white/2 px-3 py-1.5 text-xs font-medium text-white/60 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
				>
					<X class="h-3.5 w-3.5" />
					<span>Limpar tudo</span>
				</button>
			</div>
		{/if}
	</div>
</div>
