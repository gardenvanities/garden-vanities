<script lang="ts">
	import SEO from "$lib/components/core/SEO.svelte";
	import Container from "$lib/components/layout/Container.svelte";
	import Section from "$lib/components/layout/Section.svelte";
	import Grid from "$lib/components/layout/Grid.svelte";
	import SectionHeader from "$lib/components/garden/SectionHeader.svelte";
	import PostCard from "$lib/components/garden/PostCard.svelte";
	import Card from "$lib/components/ui/Card.svelte";
	import { formatRelativeDate } from "$lib/utils/date";
	import { fly, fade } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
	import { FolderOpen, Sparkles, Library, ArrowDown } from "@lucide/svelte";
	import type { PostFrontmatter } from "$lib/types";

	interface SeriesItem {
		name: string;
		slug: string;
		count: number;
		lastUpdated: string;
	}

	interface Props {
		data: {
			mocs: Array<{ name: string; count: number; href: string }>;
			series: SeriesItem[];
			freshPosts: PostFrontmatter[];
		};
	}

	let { data }: Props = $props();
</script>

<SEO title="Garden of Vanities" type="website" />

<!-- SECTION A: Hero (Premium) -->
<Section class="relative flex min-h-[75vh] items-center overflow-hidden py-20 md:py-32">
	<!-- Glow decorativo de fundo -->
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<div
			class="absolute left-1/2 top-1/3 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-accent/25 via-primary/15 to-transparent opacity-50 blur-[100px] dark:from-accent/15 dark:via-primary/10 dark:opacity-40"
		></div>
		<div
			class="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-t from-primary/20 to-transparent opacity-40 blur-[80px] dark:opacity-25"
		></div>
	</div>

	<Container size="lg">
		<div class="mx-auto max-w-3xl space-y-10 text-center">
			<!-- Tagline -->
			<p
				class="text-muted text-xs font-medium uppercase tracking-[0.25em] md:text-sm"
				in:fade={{ duration: 800, delay: 0, easing: cubicOut }}
			>
				Um labirinto de pensamentos cultivados à meia-luz
			</p>

			<!-- Título principal -->
			<h1
				class="font-heading text-6xl font-bold leading-[0.95] tracking-tight md:text-8xl"
				in:fly={{ y: 30, duration: 1000, delay: 150, easing: cubicOut }}
			>
				<span
					class="bg-gradient-to-b from-text via-text/90 to-muted/70 bg-clip-text text-transparent"
				>
					Garden of
				</span>
				<br />
				<span
					class="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent"
				>
					Vanities
				</span>
			</h1>

			<!-- Descrição poética -->
			<p
				class="text-muted/80 mx-auto max-w-xl text-lg font-light leading-relaxed md:text-xl"
				in:fly={{ y: 20, duration: 800, delay: 350, easing: cubicOut }}
			>
				Onde ideias brotam como flores noturnas. Algumas ainda são sementes adormecidas; outras já
				perfumam o escuro.
				<span class="text-accent mt-1 block italic">Entre. Não há pressa aqui.</span>
			</p>

			<!-- CTA sutil -->
			<div in:fade={{ duration: 600, delay: 550, easing: cubicOut }}>
				<a
					href="#content"
					class="text-muted hover:text-primary inline-flex items-center gap-2 pt-4 transition-colors duration-300"
				>
					<span class="text-sm tracking-wide">Começar a explorar</span>
					<ArrowDown size={16} class="animate-bounce" />
				</a>
			</div>
		</div>
	</Container>
</Section>

<!-- SECTION F: Freshness -->
<Section id="content" class="py-12">
	<Container size="lg">
		<div in:fly={{ y: 30, duration: 800, delay: 400 }}>
			<!-- Section: Areas of Interest (MOCs) -->
			{#if data.mocs.length > 0}
				<div class="space-y-8">
					<div class="flex items-center justify-between">
						<SectionHeader title="Áreas de Interesse" icon={FolderOpen} />
						<a
							href="/topics"
							class="text-muted hover:text-primary text-sm font-medium transition-colors"
						>
							Ver <strong>{data.mocs.length}+</strong> tópicos →
						</a>
					</div>

					<Grid cols={3} gap="md">
						{#each data.mocs as moc (moc.name)}
							<Card
								as="a"
								href={moc.href}
								class="group flex items-center justify-between p-4 transition-all hover:-translate-y-1"
								variant="default"
							>
								<span class="text-text group-hover:text-primary font-medium transition-colors">
									{moc.name}
								</span>
								<span
									class="bg-surface-elevated text-muted rounded-full px-2 py-0.5 text-xs font-bold"
								>
									{moc.count}
								</span>
							</Card>
						{/each}
					</Grid>
				</div>
			{/if}

			<!-- Section: Series -->
			{#if data.series && data.series.length > 0}
				<div class="mt-12 space-y-8" in:fly={{ y: 20, duration: 800, delay: 100 }}>
					<div class="flex items-center justify-between">
						<SectionHeader title="Séries & Coleções" icon={Library} />
						<a
							href="/series"
							class="text-muted hover:text-primary text-sm font-medium transition-colors"
						>
							Ver todas as séries →
						</a>
					</div>

					<Grid cols={3} gap="md">
						{#each data.series as serie (serie.slug)}
							<Card
								as="a"
								href="/series/{serie.slug}"
								class="group relative flex flex-col gap-3 p-5 transition-all duration-300 hover:-translate-y-1"
								variant="default"
							>
								<div class="flex items-center justify-between">
									<h3
										class="font-heading text-text group-hover:text-primary text-lg font-bold transition-colors"
									>
										{serie.name}
									</h3>
									<Library
										size={16}
										class="text-muted group-hover:text-primary transition-colors"
									/>
								</div>

								<div class="text-muted mt-auto flex items-center justify-between pt-2 text-xs">
									<span>{serie.count} partes</span>
									<span>Atualizado {formatRelativeDate(serie.lastUpdated)}</span>
								</div>
							</Card>
						{/each}
					</Grid>
				</div>
			{/if}

			<!-- Section: Fresh Posts -->
			{#if data.freshPosts.length > 0}
				<div class="space-y-8">
					<SectionHeader title="Atividade Recente" icon={Sparkles} />
					<div class="space-y-6">
						{#each data.freshPosts as post (post.slug)}
							<div class="group">
								<PostCard {post} compact />
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</Container>
</Section>
