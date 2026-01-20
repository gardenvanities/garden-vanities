<script lang="ts">
	import type { ResourceStats, ResourceType } from "$lib/modules/library/types";
	import { TYPE_LABELS_PLURAL } from "$lib/modules/library/types";
	import TypeIcon from "./TypeIcon.svelte";
	import { BookOpen, CheckCircle, Clock, Layers } from "@lucide/svelte";

	interface Props {
		stats: ResourceStats;
		compact?: boolean;
	}

	let { stats, compact = false }: Props = $props();

	// Get types with counts > 0, sorted by count
	const activeTypes = $derived(
		(Object.entries(stats.byType) as [ResourceType, number][])
			.filter(([_, count]) => count > 0)
			.sort((a, b) => b[1] - a[1])
	);

	const statCards = $derived([
		{
			label: "Total",
			value: stats.total,
			icon: Layers,
			gradient: "from-brand-500/20 to-brand-600/10",
			iconColor: "text-brand-400"
		},
		{
			label: "Concluídos",
			value: stats.completed,
			icon: CheckCircle,
			gradient: "from-emerald-500/20 to-emerald-600/10",
			iconColor: "text-emerald-400"
		},
		{
			label: "Em progresso",
			value: stats.inProgress,
			icon: BookOpen,
			gradient: "from-blue-500/20 to-blue-600/10",
			iconColor: "text-blue-400"
		},
		{
			label: "Na fila",
			value: stats.queued,
			icon: Clock,
			gradient: "from-amber-500/20 to-amber-600/10",
			iconColor: "text-amber-400"
		}
	]);
</script>

{#if compact}
	<!-- Compact stats for smaller spaces -->
	<div class="flex flex-wrap items-center gap-4">
		{#each statCards as stat}
			<div class="flex items-center gap-2">
				<stat.icon class="h-4 w-4 {stat.iconColor}" />
				<span class="text-lg font-bold text-white">{stat.value}</span>
				<span class="text-sm text-white/50">{stat.label}</span>
			</div>
		{/each}
	</div>
{:else}
	<!-- Full stats display -->
	<div class="space-y-6">
		<!-- Main Stats Grid -->
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			{#each statCards as stat}
				<div
					class="group relative overflow-hidden rounded-2xl border border-white/6 bg-linear-to-br {stat.gradient} p-5 transition-all duration-300 hover:border-white/10"
				>
					<!-- Background pattern -->
					<div
						class="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-linear-to-br {stat.gradient} opacity-50 blur-2xl transition-opacity duration-300 group-hover:opacity-80"
					></div>

					<div class="relative flex items-start justify-between">
						<div>
							<p class="text-3xl font-bold tabular-nums text-white">{stat.value}</p>
							<p class="mt-1 text-sm font-medium text-white/50">{stat.label}</p>
						</div>
						<div
							class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10"
						>
							<stat.icon class="h-5 w-5 {stat.iconColor}" />
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Type breakdown -->
		{#if activeTypes.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each activeTypes as [type, count]}
					<a
						href="/library/{type === 'tv-series'
							? 'series-tv'
							: type === 'album' || type === 'track' || type === 'playlist'
								? 'music'
								: type + 's'}"
						class="group flex items-center gap-2 rounded-full border border-white/6 bg-white/2 px-3.5 py-2 transition-all duration-200 hover:border-brand-500/30 hover:bg-brand-500/5"
					>
						<TypeIcon {type} class="h-4 w-4 text-white/40 transition-colors group-hover:text-brand-400" />
						<span class="text-sm font-medium tabular-nums text-white/70 group-hover:text-white">{count}</span>
						<span class="text-xs text-white/40 group-hover:text-white/60">{TYPE_LABELS_PLURAL[type]}</span>
					</a>
				{/each}
			</div>
		{/if}
	</div>
{/if}
