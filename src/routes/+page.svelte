<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import Grid from "$lib/layout/Grid.svelte";
	import SectionHeader from "$lib/modules/garden/components/SectionHeader.svelte";
	import PostCard from "$lib/modules/posts/components/PostCard.svelte";
	import Card from "$lib/ui/Card.svelte";
	import Hero from "./_components/Hero.svelte";
	import { formatRelativeDate } from "$lib/modules/posts/utils/date";
	import { fly } from "svelte/transition";

	import { FolderOpen, Sparkles, Library } from "@lucide/svelte";
	import type { PostFrontmatter } from "$lib/modules/posts/types";

	interface SeriesItem {
		slug: string;
		title: string;
		count: number;
		lastUpdated: string;
	}

	interface SetItem {
		slug: string;
		title: string;
		count: number;
		href: string;
	}

	interface Props {
		data: {
			sets: SetItem[];
			series: SeriesItem[];
			freshPosts: PostFrontmatter[];
		};
	}

	let { data }: Props = $props();
</script>

<SEO title="Garden of Vanities" type="website" />

<Hero />

<Section id="content" class="py-12">
	<Container size="lg">
		<div in:fly={{ y: 30, duration: 800, delay: 400 }}>
			{#if data.sets.length > 0}
				<div class="space-y-8">
					<div class="flex items-center justify-between">
						<SectionHeader title="Coleções" icon={FolderOpen} />
						<a
							href="/sets"
							class="text-muted hover:text-primary text-sm font-medium transition-colors"
						>
							Ver <strong>{data.sets.length}+</strong> Coleções →
						</a>
					</div>

					<Grid cols={3} gap="md">
						{#each data.sets as set (set.slug)}
							<Card
								as="a"
								href={set.href}
								class="group flex items-center justify-between p-4 transition-all hover:-translate-y-1"
								variant="default"
							>
								<span class="text-text group-hover:text-primary font-medium transition-colors">
									{set.title}
								</span>
								<span
									class="bg-surface-elevated text-muted rounded-full px-2 py-0.5 text-xs font-bold"
								>
									{set.count}
								</span>
							</Card>
						{/each}
					</Grid>
				</div>
			{/if}

			{#if data.series && data.series.length > 0}
				<div class="mt-12 space-y-8" in:fly={{ y: 20, duration: 800, delay: 100 }}>
					<div class="flex items-center justify-between">
						<SectionHeader title="Séries" icon={Library} />
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
										{serie.title}
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
