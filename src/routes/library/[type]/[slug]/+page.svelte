<script lang="ts">
	import { Badge } from "$lib/ui";
	import Section from "$lib/layout/Section.svelte";
	import Container from "$lib/layout/Container.svelte";
	import { ArrowRight, Book, Calendar, ExternalLink, Hash, Users, Bookmark } from "@lucide/svelte";
	import StatusBadge from "$lib/modules/library/components/StatusBadge.svelte";
	import RatingStars from "$lib/modules/library/components/RatingStars.svelte";
	import { TYPE_LABELS } from "$lib/modules/library/types";
	import SEO from "$lib/core/seo/SEO.svelte";

	let { data } = $props();
	let { resource, relatedResources } = $derived(data);
	
	
	

</script>

<SEO
	title="{resource.title} | Biblioteca"
	description={resource.summary || `Detalhes sobre ${resource.title}`}
/>

<div class="relative min-h-[50vh] w-full overflow-hidden bg-background">
	
	{#if resource.cover}
		<div class="absolute inset-0 z-0">
			<img
				src={resource.cover.url}
				alt=""
				class="h-full w-full object-cover opacity-10 blur-xl filter"
			/>
			<div class="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent"></div>
		</div>
	{/if}

	<Section class="relative z-10 pt-16 md:pt-24">
		<Container>
			<div class="grid gap-8 lg:grid-cols-[1fr_300px] lg:gap-12">
				
				<div class="space-y-8">
					
					<div class="space-y-4">
						<div class="flex flex-wrap items-center gap-2">
							<Badge variant="secondary" class="gap-1">
								<Book class="h-3 w-3" />
								{TYPE_LABELS[resource.type]}
							</Badge>
							
							{#if resource.publishedAt}
								<Badge variant="outline" class="gap-1">
									<Calendar class="h-3 w-3" />
									{new Date(resource.publishedAt).getFullYear()}
								</Badge>
							{/if}

							<StatusBadge status={resource.status} />
						</div>

						<h1 class="font-heading text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
							{resource.title}
						</h1>

						{#if resource.subtitle}
							<p class="text-xl text-muted-foreground md:text-2xl">
								{resource.subtitle}
							</p>
						{/if}

						{#if resource.author}
							<div class="flex items-center gap-2 pt-2 text-muted-foreground">
								<Users class="h-4 w-4" />
								<span>{resource.author}</span>
							</div>
						{/if}
						
						{#if resource.rating}
							<div class="pt-2">
								<RatingStars rating={resource.rating} />
							</div>
						{/if}
					</div>
					
					
					<div class="rounded-lg border bg-card p-6 shadow-sm lg:hidden">
						
					</div>

					
					{#if resource.html}
						<div class="prose prose-lg dark:prose-invert max-w-none">
							
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html resource.html}
						</div>
					{:else if resource.summary}
						<div class="rounded-lg border bg-muted/30 p-8">
							<h3 class="mb-4 text-lg font-semibold flex items-center gap-2">
								<Bookmark class="h-5 w-5" />
								Resumo
							</h3>
							<p class="text-lg leading-relaxed text-muted-foreground">
								{resource.summary}
							</p>
						</div>
					{/if}
				</div>

				
				<div class="hidden space-y-8 lg:block">
					<div class="sticky top-24 space-y-8">
						
						<div class="overflow-hidden rounded-lg border bg-muted shadow-lg aspect-2/3">
							{#if resource.cover}
								<img
									src={resource.cover.url}
									alt={resource.cover.alt || resource.title}
									class="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
								/>
							{:else}
								<div class="flex h-full w-full items-center justify-center bg-muted">
									<Book class="h-16 w-16 text-muted-foreground/30" />
								</div>
							{/if}
						</div>

						
						<div class="grid gap-3">
							{#if resource.url}
								<a
									href={resource.url}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
								>
									Ver Original
									<ExternalLink class="h-4 w-4" />
								</a>
							{/if}
						</div>

						
						{#if resource.tags && resource.tags.length > 0}
							<div class="space-y-3 pt-4 border-t">
								<h3 class="text-sm font-medium flex items-center gap-2">
									<Hash class="h-4 w-4" />
									Tags
								</h3>
								<div class="flex flex-wrap gap-2">
									{#each resource.tags as tag (tag)}
										<Badge variant="secondary" class="hover:bg-secondary/80">
											#{tag}
										</Badge>
									{/each}
								</div>
							</div>
						{/if}
						
						{#if resource.metadata}
							<div class="space-y-3 pt-4 border-t">
								<h3 class="text-sm font-medium">Informações</h3>
								<dl class="space-y-2 text-sm">
									{#each Object.entries(resource.metadata) as [key, value] (key)}
										<div class="flex justify-between">
											<dt class="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</dt>
											<dd class="font-medium text-right">{value}</dd>
										</div>
									{/each}
								</dl>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</Container>
	</Section>
</div>

{#if relatedResources.length > 0}
	<Section class="bg-muted/30 py-16">
		<Container>
			<div class="mb-8 flex items-center justify-between">
				<h2 class="font-heading text-2xl font-bold">Relacionados</h2>
				<a href="/library" class="text-sm font-medium text-primary hover:underline group flex items-center gap-1">
					Ver biblioteca
					<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</a>
			</div>
			
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{#each relatedResources as item (item.slug)}
					
					<a 
						href="/library/{item.type}/{item.slug}"
						class="group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
					>
						<div class="aspect-3/4 overflow-hidden bg-muted">
							{#if item.cover}
								<img 
									src={item.cover.url} 
									alt={item.title} 
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
								/>
							{:else}
								<div class="flex h-full w-full items-center justify-center">
									<Book class="h-10 w-10 text-muted-foreground/30" />
								</div>
							{/if}
						</div>
						<div class="flex flex-1 flex-col p-4">
							<h3 class="line-clamp-2 font-medium group-hover:text-primary">
								{item.title}
							</h3>
							{#if item.author}
								<p class="mt-1 line-clamp-1 text-sm text-muted-foreground">
									{item.author}
								</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</Container>
	</Section>
{/if}
