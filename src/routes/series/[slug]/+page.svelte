<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import PostCard from "$lib/modules/posts/components/PostCard.svelte";
	import {
		Library,
		ArrowLeft,
		ExternalLink,
		Github,
		Youtube,
		FileText,
		Link
	} from "@lucide/svelte";
	import { fly } from "svelte/transition";
	import type { ResourceLink } from "$lib/modules/posts/collections";

	let { data } = $props();

	function getStatusLabel(status: string) {
		const labels: Record<string, { text: string; class: string }> = {
			ongoing: { text: "Em andamento", class: "bg-primary/15 text-primary" },
			completed: { text: "Completa", class: "bg-green-500/15 text-green-600" },
			archived: { text: "Arquivada", class: "bg-muted/30 text-muted" },
			draft: { text: "Rascunho", class: "bg-yellow-500/15 text-yellow-600" }
		};
		return labels[status] || labels.ongoing;
	}

	function getResourceIcon(type: ResourceLink["type"]) {
		const icons = {
			github: Github,
			youtube: Youtube,
			pdf: FileText,
			link: Link
		};
		return icons[type] || Link;
	}

	const statusInfo = $derived(getStatusLabel(data.series.status));
</script>

<SEO
	title="{data.series.title} | Séries do Jardim"
	description={data.series.description ||
		`Uma coleção de notas ordenadas sobre ${data.series.title}.`}
/>

<Section class="py-12">
	<Container size="md">
		<a
			href="/series"
			class="text-muted hover:text-primary mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors"
		>
			<ArrowLeft size={16} />
			Voltar para Séries
		</a>

		<div in:fly={{ y: 20, duration: 800 }}>
			<!-- Series Header -->
			<div class="mb-12 text-center">
				<div class="mb-6 flex items-center justify-center gap-3">
					<div
						class="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-2xl"
					>
						<Library size={32} />
					</div>
				</div>

				<span class="rounded-full px-3 py-1 text-xs font-medium {statusInfo.class}">
					{statusInfo.text}
				</span>

				<h1 class="font-heading text-text mt-4 mb-4 text-4xl font-bold">{data.series.title}</h1>

				{#if data.series.description}
					<p class="text-muted mx-auto max-w-2xl text-xl">
						{data.series.description}
					</p>
				{/if}

				<p class="text-muted mt-4 text-sm">
					{data.posts.length}
					{data.posts.length === 1 ? "parte" : "partes"} nesta coleção.
				</p>
			</div>

			<!-- Resources Section -->
			{#if data.series.resources && data.series.resources.length > 0}
				<div class="bg-surface-elevated border-border mb-10 rounded-xl border p-6">
					<h2 class="text-text font-heading mb-4 text-lg font-bold">Recursos da Série</h2>
					<div class="flex flex-wrap gap-3">
						{#each data.series.resources as resource (resource.url)}
							{@const IconComponent = getResourceIcon(resource.type)}
							<a
								href={resource.url}
								target="_blank"
								rel="noopener noreferrer"
								class="bg-surface border-border hover:border-primary text-muted hover:text-primary inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
							>
								<IconComponent size={16} />
								{resource.title}
								<ExternalLink size={12} class="opacity-50" />
							</a>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Posts Timeline -->
			<div
				class="before:via-border relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-linear-to-b before:from-transparent before:to-transparent md:before:ml-10"
			>
				{#each data.posts as post, i (post.slug)}
					<div
						class="relative flex items-start gap-4 md:gap-8"
						in:fly={{ y: 20, duration: 500, delay: i * 100 }}
					>
						<div
							class="bg-surface border-border text-muted relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold shadow-sm md:h-20 md:w-20 md:text-2xl"
						>
							{post.series?.order || i + 1}
						</div>

						<div class="flex-1">
							<PostCard {post} />
						</div>
					</div>
				{/each}
			</div>
		</div>
	</Container>
</Section>
