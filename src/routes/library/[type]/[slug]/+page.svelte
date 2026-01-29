<script lang="ts">
	import { Container } from "$lib/layout";
	import {
		StatusBadge,
		RatingStars,
		TypeIcon,
		TYPE_LABELS,
		TYPE_LABELS_PLURAL,
		type ResourceType
	} from "$lib/modules/library";
	import { buildCloudinaryUrl } from "$lib/shared/cloudinary";
	import {
		ChevronLeft,
		ExternalLink,
		ShoppingCart,
		Calendar,
		Clock,
		BookOpen,
		User,
		Building,
		Globe,
		Tag,
		Play,
		Hash,
		FileText,
		Quote
	} from "@lucide/svelte";
	import { formatDate } from "$lib/modules/posts";

	let { data } = $props();
	const resource = $derived(data.resource);

	// Get author/creator string
	function getCreator(): string | null {
		if ("author" in resource && resource.author) {
			return Array.isArray(resource.author) ? resource.author.join(", ") : resource.author;
		}
		if ("authors" in resource && resource.authors) {
			return resource.authors.join(", ");
		}
		if ("director" in resource && resource.director) {
			return Array.isArray(resource.director) ? resource.director.join(", ") : resource.director;
		}
		if ("artist" in resource && resource.artist) {
			return Array.isArray(resource.artist) ? resource.artist.join(", ") : resource.artist;
		}
		if ("creator" in resource && resource.creator) {
			return Array.isArray(resource.creator) ? resource.creator.join(", ") : resource.creator;
		}
		return null;
	}

	const creator = getCreator();

	// Type colors for accents
	const typeColors: Record<ResourceType, string> = {
		book: "from-amber-500 to-orange-600",
		film: "from-rose-500 to-pink-600",
		"tv-series": "from-violet-500 to-purple-600",
		album: "from-emerald-500 to-teal-600",
		track: "from-cyan-500 to-blue-600",
		playlist: "from-lime-500 to-green-600",
		article: "from-sky-500 to-indigo-600",
		paper: "from-fuchsia-500 to-purple-600"
	};
</script>

<svelte:head>
	<title>{resource.title} | {data.typeLabel} | Biblioteca</title>
	<meta
		name="description"
		content={resource.summary || `${resource.title} - ${data.typeLabel} na minha biblioteca.`}
	/>
</svelte:head>

<Container class="py-12 md:py-16">
	<!-- Breadcrumb -->
	<nav class="mb-10">
		<div class="flex items-center gap-2 text-sm">
			<a href="/library" class="hover:text-brand-400 text-white/40 transition-colors">
				Biblioteca
			</a>
			<span class="text-white/20">/</span>
			<a href="/library/{data.folder}" class="hover:text-brand-400 text-white/40 transition-colors">
				{TYPE_LABELS_PLURAL[data.resourceType]}
			</a>
			<span class="text-white/20">/</span>
			<span class="line-clamp-1 text-white/60">{resource.title}</span>
		</div>
	</nav>

	<!-- Main Content -->
	<div class="mx-auto max-w-5xl">
		<div class="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
			<!-- Sidebar: Cover & Meta -->
			<aside class="space-y-6">
				<!-- Cover with gradient accent -->
				<div class="group relative">
					<!-- Gradient glow -->
					<div
						class="absolute -inset-2 rounded-3xl bg-linear-to-br {typeColors[
							resource.type
						]} opacity-10 blur-xl transition-opacity group-hover:opacity-20"
					></div>

					<div
						class="relative aspect-3/4 overflow-hidden rounded-2xl border border-white/8 bg-neutral-900 shadow-2xl ring-1 ring-white/5"
					>
						{#if resource.cover?.url}
							<img
								src={buildCloudinaryUrl(resource.cover.url, { width: 600 })}
								alt=""
								class="h-full w-full object-cover"
								loading="eager"
							/>
						{:else}
							<div
								class="flex h-full w-full items-center justify-center bg-linear-to-br {typeColors[
									resource.type
								]}/10"
							>
								<TypeIcon type={resource.type} class="h-16 w-16 text-white/20" />
							</div>
						{/if}
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex flex-col gap-2">
					{#if resource.affiliateLink}
						<a
							href={resource.affiliateLink}
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center justify-center gap-2.5 rounded-xl bg-linear-to-r {typeColors[
								resource.type
							]} hover:shadow-brand-500/20 px-5 py-3.5 font-medium text-white shadow-lg transition-all hover:shadow-xl"
						>
							<ShoppingCart class="h-5 w-5" />
							<span>Adquirir</span>
							<ExternalLink class="h-4 w-4 opacity-60" />
						</a>
					{/if}

					{#if resource.externalLink}
						<a
							href={resource.externalLink}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/2 px-5 py-3 text-white/70 transition-all hover:border-white/15 hover:bg-white/5 hover:text-white"
						>
							<ExternalLink class="h-5 w-5" />
							<span>Ver original</span>
						</a>
					{/if}
				</div>

				<!-- Metadata Card -->
				<div class="space-y-4 rounded-2xl border border-white/6 bg-white/2 p-5">
					<h3 class="font-sans text-xs font-semibold tracking-widest text-white/30 uppercase">
						Informações
					</h3>

					<div class="space-y-3">
						<!-- Type -->
						<div class="flex items-center gap-3 text-sm">
							<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/4">
								<TypeIcon type={resource.type} class="h-4 w-4 text-white/50" />
							</div>
							<span class="text-white/70">{TYPE_LABELS[resource.type]}</span>
						</div>

						<!-- Year -->
						{#if "year" in resource && resource.year}
							<div class="flex items-center gap-3 text-sm">
								<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/4">
									<Calendar class="h-4 w-4 text-white/50" />
								</div>
								<span class="text-white/70">{resource.year}</span>
							</div>
						{/if}

						<!-- Pages (books) -->
						{#if "pages" in resource && resource.pages}
							<div class="flex items-center gap-3 text-sm">
								<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/4">
									<BookOpen class="h-4 w-4 text-white/50" />
								</div>
								<span class="text-white/70">{resource.pages} páginas</span>
							</div>
						{/if}

						<!-- Runtime (films) -->
						{#if "runtime" in resource && resource.runtime}
							<div class="flex items-center gap-3 text-sm">
								<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/4">
									<Clock class="h-4 w-4 text-white/50" />
								</div>
								<span class="text-white/70">{resource.runtime} minutos</span>
							</div>
						{/if}

						<!-- Seasons/Episodes (TV) -->
						{#if "seasons" in resource && resource.seasons}
							<div class="flex items-center gap-3 text-sm">
								<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/4">
									<Play class="h-4 w-4 text-white/50" />
								</div>
								<span class="text-white/70">
									{resource.seasons} temporada{resource.seasons !== 1 ? "s" : ""}
									{#if "episodes" in resource && resource.episodes}
										· {resource.episodes} episódios
									{/if}
								</span>
							</div>
						{/if}

						<!-- Publisher -->
						{#if "publisher" in resource && resource.publisher}
							<div class="flex items-center gap-3 text-sm">
								<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/4">
									<Building class="h-4 w-4 text-white/50" />
								</div>
								<span class="text-white/70">{resource.publisher}</span>
							</div>
						{/if}

						<!-- Journal (papers) -->
						{#if "journal" in resource && resource.journal}
							<div class="flex items-center gap-3 text-sm">
								<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/4">
									<FileText class="h-4 w-4 text-white/50" />
								</div>
								<span class="text-white/70">{resource.journal}</span>
							</div>
						{/if}

						<!-- Language -->
						{#if "language" in resource && resource.language}
							<div class="flex items-center gap-3 text-sm">
								<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/4">
									<Globe class="h-4 w-4 text-white/50" />
								</div>
								<span class="text-white/70">{resource.language.toUpperCase()}</span>
							</div>
						{/if}

						<!-- DOI (papers) -->
						{#if "doi" in resource && resource.doi}
							<div class="flex items-center gap-3 text-sm">
								<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/4">
									<Hash class="h-4 w-4 text-white/50" />
								</div>
								<span class="truncate text-white/70">{resource.doi}</span>
							</div>
						{/if}
					</div>

					<!-- Genres -->
					{#if "genres" in resource && resource.genres && resource.genres.length > 0}
						<div class="border-t border-white/6 pt-4">
							<div class="flex flex-wrap gap-1.5">
								{#each resource.genres as genre (genre)}
									<span class="rounded-md bg-white/4 px-2 py-1 text-xs text-white/50">
										{genre}
									</span>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Consumption Dates -->
					{#if resource.startedAt || resource.completedAt}
						<div class="border-t border-white/6 pt-4 text-xs text-white/30">
							{#if resource.startedAt}
								<p>Iniciado em {formatDate(resource.startedAt)}</p>
							{/if}
							{#if resource.completedAt}
								<p class="mt-1">Concluído em {formatDate(resource.completedAt)}</p>
							{/if}
						</div>
					{/if}
				</div>
			</aside>

			<!-- Content -->
			<article class="space-y-10">
				<!-- Header -->
				<header class="space-y-5">
					<div class="flex flex-wrap items-center gap-3">
						<StatusBadge status={resource.status} size="md" />
						{#if resource.rating}
							<RatingStars rating={resource.rating} size="md" />
						{/if}
					</div>

					<h1
						class="font-heading text-3xl leading-tight font-bold text-white md:text-4xl lg:text-5xl"
					>
						{resource.title}
					</h1>

					{#if resource.subtitle}
						<p class="text-xl leading-relaxed text-white/50">{resource.subtitle}</p>
					{/if}

					{#if creator}
						<div class="flex items-center gap-2.5 text-lg text-white/40">
							<User class="h-5 w-5" />
							<span>{creator}</span>
						</div>
					{/if}
				</header>

				<!-- Summary -->
				{#if resource.summary}
					<section class="prose prose-lg prose-invert max-w-none">
						<p class="text-lg leading-relaxed text-white/60">{resource.summary}</p>
					</section>
				{/if}

				<!-- Personal Notes -->
				{#if resource.personalNotes}
					<section
						class="border-brand-500/20 from-brand-500/5 relative overflow-hidden rounded-2xl border bg-linear-to-br to-transparent p-6"
					>
						<Quote class="text-brand-500/10 absolute -top-4 -right-4 h-24 w-24" />
						<h2 class="font-heading relative mb-4 text-xl font-medium text-white">Minhas Notas</h2>
						<p class="relative leading-relaxed text-white/60">{resource.personalNotes}</p>
					</section>
				{/if}

				<!-- Tags -->
				{#if resource.tags && resource.tags.length > 0}
					<section>
						<h2
							class="mb-4 flex items-center gap-2 text-sm font-medium tracking-wider text-white/30 uppercase"
						>
							<Tag class="h-4 w-4" />
							Tags
						</h2>
						<div class="flex flex-wrap gap-2">
							{#each resource.tags as tag (tag)}
								<span
									class="hover:border-brand-500/30 hover:text-brand-400 rounded-lg border border-white/8 bg-white/3 px-3 py-1.5 text-sm text-white/50 transition-colors"
								>
									#{tag}
								</span>
							{/each}
						</div>
					</section>
				{/if}
			</article>
		</div>
	</div>

	<!-- Back Link -->
	<div class="mx-auto mt-16 max-w-5xl border-t border-white/6 pt-8">
		<a
			href="/library/{data.folder}"
			class="group hover:text-brand-400 inline-flex items-center gap-2 text-sm text-white/40 transition-colors"
		>
			<ChevronLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
			Voltar para {TYPE_LABELS_PLURAL[data.resourceType]}
		</a>
	</div>
</Container>
