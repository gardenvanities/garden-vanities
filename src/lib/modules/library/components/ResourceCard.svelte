<script lang="ts">
	import type { Resource, ResourceType } from "$lib/modules/library/types";
	import { TYPE_LABELS } from "$lib/modules/library/types";
	import StatusBadge from "./StatusBadge.svelte";
	import RatingStars from "./RatingStars.svelte";
	import TypeIcon from "./TypeIcon.svelte";
	import { buildCloudinaryUrl } from "$lib/shared/cloudinary";

	interface Props {
		resource: Resource;
		showType?: boolean;
		variant?: "default" | "compact" | "horizontal";
	}

	let { resource, showType = true, variant = "default" }: Props = $props();

	const href = $derived(() => {
		const type = resource.type;
		const folder =
			type === "tv-series"
				? "series-tv"
				: type === "album" || type === "track" || type === "playlist"
					? "music"
					: type + "s";
		return `/library/${folder}/${resource.slug}`;
	});

	// Get creator name
	function getCreator(): string | null {
		if ("author" in resource && resource.author) {
			return Array.isArray(resource.author) ? resource.author[0] : resource.author;
		}
		if ("director" in resource && resource.director) {
			return Array.isArray(resource.director) ? resource.director[0] : resource.director;
		}
		if ("artist" in resource && resource.artist) {
			return Array.isArray(resource.artist) ? resource.artist[0] : resource.artist;
		}
		if ("creator" in resource && resource.creator) {
			return Array.isArray(resource.creator) ? resource.creator[0] : resource.creator;
		}
		if ("authors" in resource && resource.authors) {
			return resource.authors[0] + (resource.authors.length > 1 ? " et al." : "");
		}
		return null;
	}

	const creator = $derived(getCreator());

	// Type colors for gradient accents
	const typeColors: Record<ResourceType, string> = {
		book: "from-amber-500/20 to-orange-600/20",
		film: "from-rose-500/20 to-pink-600/20",
		"tv-series": "from-violet-500/20 to-purple-600/20",
		album: "from-emerald-500/20 to-teal-600/20",
		track: "from-cyan-500/20 to-blue-600/20",
		playlist: "from-lime-500/20 to-green-600/20",
		article: "from-sky-500/20 to-indigo-600/20",
		paper: "from-fuchsia-500/20 to-purple-600/20"
	};
</script>

{#if variant === "horizontal"}
	<!-- Horizontal Card (for "Currently Consuming" section) -->
	<a
		href={href()}
		class="group relative flex gap-4 overflow-hidden rounded-2xl border border-white/6 bg-linear-to-br from-white/3 to-transparent p-4 backdrop-blur-sm transition-all duration-300 hover:border-brand-500/30 hover:from-white/6 hover:shadow-lg hover:shadow-brand-500/5"
	>
		<!-- Subtle gradient accent based on type -->
		<div
			class="pointer-events-none absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 {typeColors[
				resource.type
			]}"
		></div>

		<!-- Cover -->
		<div
			class="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-800 shadow-lg ring-1 ring-white/10"
		>
			{#if resource.cover?.url}
				<img
					src={buildCloudinaryUrl(resource.cover.url, { width: 200 })}
					alt=""
					class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					loading="lazy"
				/>
			{:else}
				<div
					class="flex h-full w-full items-center justify-center bg-linear-to-br {typeColors[
						resource.type
					]}"
				>
					<TypeIcon type={resource.type} class="h-6 w-6 text-white/40" />
				</div>
			{/if}
		</div>

		<!-- Content -->
		<div class="relative flex min-w-0 flex-1 flex-col justify-center">
			<div class="flex items-center gap-2">
				<StatusBadge status={resource.status} size="sm" />
				{#if showType}
					<span class="flex items-center gap-1 text-xs text-white/40">
						<TypeIcon type={resource.type} class="h-3 w-3" />
						{TYPE_LABELS[resource.type]}
					</span>
				{/if}
			</div>

			<h3
				class="mt-2 truncate font-serif text-base font-medium text-white transition-colors group-hover:text-brand-400"
			>
				{resource.title}
			</h3>

			{#if creator}
				<p class="mt-1 truncate text-sm text-white/50">{creator}</p>
			{/if}

			{#if resource.rating}
				<div class="mt-2">
					<RatingStars rating={resource.rating} size="sm" />
				</div>
			{/if}
		</div>

		<!-- Progress indicator line -->
		<div
			class="absolute bottom-0 left-0 h-0.5 w-1/3 bg-linear-to-r from-brand-500 to-brand-400 opacity-60"
		></div>
	</a>
{:else if variant === "compact"}
	<!-- Compact Card (for smaller grids) -->
	<a
		href={href()}
		class="group relative flex flex-col overflow-hidden rounded-xl border border-white/6 bg-linear-to-b from-white/2 to-transparent transition-all duration-300 hover:border-white/10 hover:from-white/4"
	>
		<div class="relative aspect-square w-full overflow-hidden bg-neutral-800">
			{#if resource.cover?.url}
				<img
					src={buildCloudinaryUrl(resource.cover.url, { width: 300 })}
					alt=""
					class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					loading="lazy"
				/>
			{:else}
				<div
					class="flex h-full w-full items-center justify-center bg-linear-to-br {typeColors[
						resource.type
					]}"
				>
					<TypeIcon type={resource.type} class="h-10 w-10 text-white/30" />
				</div>
			{/if}

			<!-- Overlay gradient -->
			<div
				class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"
			></div>

			<!-- Bottom content -->
			<div class="absolute inset-x-0 bottom-0 p-3">
				<h3
					class="line-clamp-2 text-sm font-medium text-white transition-colors group-hover:text-brand-400"
				>
					{resource.title}
				</h3>
			</div>
		</div>
	</a>
{:else}
	<!-- Default Card -->
	<a
		href={href()}
		class="group relative flex flex-col overflow-hidden rounded-2xl border border-white/6 bg-linear-to-b from-white/3 to-transparent transition-all duration-300 hover:border-white/10 hover:from-white/5 hover:shadow-xl hover:shadow-black/20"
	>
		<!-- Cover Image -->
		<div class="relative aspect-3/4 w-full overflow-hidden bg-neutral-800/50">
			{#if resource.cover?.url}
				<img
					src={buildCloudinaryUrl(resource.cover.url, { width: 400 })}
					alt=""
					class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					loading="lazy"
				/>
			{:else}
				<div
					class="flex h-full w-full items-center justify-center bg-linear-to-br {typeColors[
						resource.type
					]}"
				>
					<TypeIcon type={resource.type} class="h-16 w-16 text-white/20" />
				</div>
			{/if}

			<!-- Gradient Overlay -->
			<div
				class="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/40 to-transparent"
			></div>

			<!-- Status Badge -->
			<div class="absolute left-3 top-3">
				<StatusBadge status={resource.status} size="sm" />
			</div>

			<!-- Type Badge (optional) -->
			{#if showType}
				<div
					class="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white/70 backdrop-blur-md ring-1 ring-white/10"
				>
					<TypeIcon type={resource.type} class="h-3 w-3" />
					<span>{TYPE_LABELS[resource.type]}</span>
				</div>
			{/if}

			<!-- Bottom info overlay -->
			<div class="absolute inset-x-0 bottom-0 p-4">
				<!-- Rating -->
				{#if resource.rating}
					<div class="mb-2">
						<RatingStars rating={resource.rating} size="sm" />
					</div>
				{/if}
			</div>
		</div>

		<!-- Content -->
		<div class="flex flex-1 flex-col gap-1 p-4">
			<!-- Title -->
			<h3
				class="line-clamp-2 font-serif text-base font-medium leading-snug text-white transition-colors group-hover:text-brand-400"
			>
				{resource.title}
			</h3>

			<!-- Creator -->
			{#if creator}
				<p class="line-clamp-1 text-sm text-white/50">{creator}</p>
			{/if}
		</div>

		<!-- Hover glow effect -->
		<div
			class="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-inset ring-brand-500/20 transition-opacity duration-300 group-hover:opacity-100"
		></div>
	</a>
{/if}
