<script lang="ts">
	import SEO from "$lib/components/core/SEO.svelte";
	import Container from "$lib/components/layout/Container.svelte";
	import Section from "$lib/components/layout/Section.svelte";
	import Grid from "$lib/components/layout/Grid.svelte";
	import SectionHeader from "$lib/components/garden/SectionHeader.svelte";
	import PostCard from "$lib/components/garden/PostCard.svelte";
	import { formatRelativeDate } from "$lib/utils/date";
	import { fly } from "svelte/transition";
	import { FolderOpen, Sparkles, Library, Map as MapIcon } from "@lucide/svelte";
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

<SEO title="Explore o Jardim | Garden of Vanities" type="website" />

<!-- SECTION A: Hero -->
<Section class="py-16 md:py-24">
	<Container size="lg">
		<div class="mx-auto max-w-4xl text-center" in:fly={{ y: 30, duration: 1000, delay: 100 }}>
			<h1 class="font-heading text-text mb-6 text-6xl font-bold">
				<MapIcon
					class="text-primary mr-2 inline-block -translate-y-2"
					size={48}
					strokeWidth={2.5}
				/>
				Explore o Jardim
			</h1>
			<p class="text-muted text-3xl leading-relaxed font-light">
				Este é um jardim de ideias em crescimento. Algumas notas ainda estão brotando, outras já
				deram frutos. Escolha um caminho e caminhe sem pressa.
			</p>
		</div>
	</Container>
</Section>

<!-- SECTION F: Freshness -->
<Section class="py-12">
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
							<a
								href={moc.href}
								class="bg-surface border-border hover:border-border-vivid group flex items-center justify-between rounded-lg border p-4 transition-all hover:-translate-y-0.5"
							>
								<span class="text-text group-hover:text-primary font-medium transition-colors">
									{moc.name}
								</span>
								<span
									class="bg-surface-elevated text-muted rounded-full px-2 py-0.5 text-xs font-bold"
								>
									{moc.count}
								</span>
							</a>
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
							<a
								href="/series/{serie.slug}"
								class="bg-surface group border-border hover:border-border-vivid relative flex flex-col gap-3 rounded-xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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
							</a>
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
