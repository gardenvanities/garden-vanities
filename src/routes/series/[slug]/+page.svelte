<script lang="ts">
	import SEO from "$lib/components/core/SEO.svelte";
	import Container from "$lib/components/layout/Container.svelte";
	import Section from "$lib/components/layout/Section.svelte";
	import PostCard from "$lib/components/garden/PostCard.svelte"; // Reusing PostCard but maybe in a list/compact mode?
	// Actually, for series, a chronological list is nice. PostCard is grid-optimized but works.
	import { Library, ArrowLeft } from "@lucide/svelte";
	import { fly } from "svelte/transition";

	let { data } = $props();
</script>

<SEO
	title="{data.seriesName} | Séries do Jardim"
	description="Uma coleção de notas ordenadas sobre {data.seriesName}."
/>

<Section class="py-12">
	<Container size="md">
		<a
			href="/explore"
			class="text-muted hover:text-primary mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors"
		>
			<ArrowLeft size={16} />
			Voltar para a Biblioteca
		</a>

		<div in:fly={{ y: 20, duration: 800 }}>
			<div class="mb-12 text-center">
				<div
					class="bg-primary/10 text-primary mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
				>
					<Library size={32} />
				</div>
				<h1 class="font-heading text-text mb-4 text-4xl font-bold">{data.seriesName}</h1>
				<p class="text-muted text-xl">
					{data.posts.length} partes nesta coleção.
				</p>
			</div>

			<div
				class="before:via-border relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-linear-to-b before:from-transparent before:to-transparent md:before:ml-10"
			>
				{#each data.posts as post, i (post.slug)}
					<div
						class="relative flex items-start gap-4 md:gap-8"
						in:fly={{ y: 20, duration: 500, delay: i * 100 }}
					>
						<!-- Number/Step -->
						<div
							class="bg-surface border-border text-muted relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold shadow-sm md:h-20 md:w-20 md:text-2xl"
						>
							{post.series?.order || i + 1}
						</div>

						<!-- Content -->
						<div class="flex-1">
							<PostCard {post} />
						</div>
					</div>
				{/each}
			</div>
		</div>
	</Container>
</Section>
