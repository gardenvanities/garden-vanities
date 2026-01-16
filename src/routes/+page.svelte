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

<!-- SECTION A: Hero (Minimalist) -->
<Section class="relative flex min-h-[85vh] items-center justify-center py-20">
	<Container size="md">
		<div
			class="mx-auto max-w-4xl text-center"
			in:fade={{ duration: 1000, delay: 200, easing: cubicOut }}
		>
			<blockquote class="space-y-8">
				<p
					class="font-heading text-text text-3xl leading-tight font-medium md:text-4xl lg:text-5xl"
				>
					"A Sabedoria clama lá fora [...] mas, visto que rejeitastes todo o meu conselho, [...]
					também eu me rirei na vossa desgraça."
				</p>
				<footer
					class="text-muted text-sm font-medium tracking-caps uppercase text-opacity-80 md:text-base"
				>
					— Provérbios 1:20, 25, 26
				</footer>
			</blockquote>
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
