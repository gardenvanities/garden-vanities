<script lang="ts">
	import { Container } from "$lib/layout";
	import CloudinaryImage from "$lib/ui/CloudinaryImage.svelte";
	import { getCreatorName } from "$lib/modules/library/utils";
	import { TYPE_LABELS } from "$lib/modules/library/types";
	import { ChevronLeft, Calendar, Star, Clock, Globe } from "@lucide/svelte";
	import ContentCard from "$lib/ui/ContentCard.svelte";

	let { data } = $props();
	let { resource } = $derived(data);
	let creator = $derived(getCreatorName(resource));
</script>

<svelte:head>
	<title>{resource.title} | {TYPE_LABELS[resource.type]} | Garden of Vanities</title>
	<meta name="description" content={resource.summary || `Detalhes sobre ${resource.title}`} />
</svelte:head>

<Container class="py-12 md:py-16">
	<!-- Breadcrumb -->
	<nav class="mb-8">
		<a
			href="/library/{resource.type === 'tv-series' ? 'series-tv' : resource.type + 's'}"
			class="hover:text-brand-400 inline-flex items-center gap-1 text-sm text-white/50 transition-colors"
		>
			<ChevronLeft class="h-4 w-4" />
			Voltar para {TYPE_LABELS[resource.type]}
		</a>
	</nav>

	<div class="grid gap-12 lg:grid-cols-[300px_1fr]">
		<!-- Sidebar / Cover -->
		<aside>
			{#if resource.cover}
				<div class="overflow-hidden rounded-lg shadow-2xl">
					<CloudinaryImage
						publicId={resource.cover.url}
						alt={resource.cover.alt || resource.title}
						width={600}
						height={900}
						class="w-full object-cover"
					/>
				</div>
			{:else}
				<div class="flex aspect-2/3 items-center justify-center rounded-lg bg-white/5 text-white/20">
					<span class="text-sm">Sem capa</span>
				</div>
			{/if}

			{#if resource.affiliateLink || resource.externalLink}
				<div class="mt-6">
					<a
						href={resource.affiliateLink || resource.externalLink}
						target="_blank"
						rel="noopener noreferrer"
						class="hover:bg-brand-500/20 active:bg-brand-500/30 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all hover:border-white/20"
					>
						<Globe size={16} />
						Ver fonte original
					</a>
				</div>
			{/if}
		</aside>

		<!-- Main Content -->
		<div class="space-y-8">
			<header class="space-y-4">
				<div class="flex items-center gap-3 text-sm font-medium tracking-wider text-white/50 uppercase">
					<span>{TYPE_LABELS[resource.type]}</span>
					{#if resource.status}
						<span class="bg-white/10 px-2 py-0.5 rounded text-xs">{resource.status}</span>
					{/if}
				</div>

				<h1 class="font-heading text-4xl font-bold text-white md:text-5xl">{resource.title}</h1>

				{#if creator}
					<p class="text-xl text-white/60">{creator}</p>
				{/if}
			</header>

			<!-- Key Metrics -->
			<div class="flex flex-wrap gap-6 border-y border-white/5 py-6">
				{#if resource.rating}
					<div class="flex items-center gap-2">
						<Star class="text-yellow-500" size={20} fill="currentColor" />
						<span class="text-lg font-bold text-white max-w-[2ch]">{resource.rating}</span>
						<span class="text-white/40">/ 5</span>
					</div>
				{/if}

				{#if resource.createdAt}
					<div class="flex items-center gap-2 text-white/60">
						<Calendar size={20} />
						<span>{new Date(resource.createdAt).toLocaleDateString("pt-BR")}</span>
					</div>
				{/if}

				<!-- Type Specific Metrics -->
				{#if resource.type === 'book' && resource.pages}
					<div class="flex items-center gap-2 text-white/60">
						<span>📖 {resource.pages} páginas</span>
					</div>
				{/if}
				
				{#if resource.type === 'film' && resource.year}
					<div class="flex items-center gap-2 text-white/60">
						<Clock size={20} />
						<span>{resource.year}</span>
					</div>
				{/if}
			</div>

			<!-- Summary / Notes -->
			{#if resource.summary}
				<section class="prose prose-invert max-w-none">
					<h3 class="text-white">Sobre</h3>
					<p>{resource.summary}</p>
				</section>
			{/if}

			{#if resource.personalNotes}
				<section class="rounded-xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
					<h3 class="mb-4 text-lg font-bold text-white">Notas Pessoais</h3>
					<div class="prose prose-invert max-w-none text-white/80">
						{@html resource.personalNotes} 
						<!-- Caution: Ideally parse md here if personalNotes is markdown -->
					</div>
				</section>
			{/if}
			
			<!-- Content Rendering via +page.svelte slot/data could go here if markdown body existed, 
			     but currently library items seem to be mostly metadata frontmatter based on types. 
				 If there is body content, we need to handle it. -->
			{#if resource.content}
				{@const Content = resource.content}
				<article class="prose prose-invert max-w-none mt-12">
					<Content />
				</article>
			{/if}
		</div>
	</div>
</Container>
