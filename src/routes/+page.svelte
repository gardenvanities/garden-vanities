<script lang="ts">
	import SEO from "$lib/components/core/SEO.svelte";
	import Container from "$lib/components/layout/Container.svelte";
	import Section from "$lib/components/layout/Section.svelte";
	import Grid from "$lib/components/layout/Grid.svelte";
	import SectionHeader from "$lib/components/garden/SectionHeader.svelte";
	import MOCCard from "$lib/components/garden/MOCCard.svelte";
	import RipenessTabs from "$lib/components/garden/RipenessTabs.svelte";
	import RipenessBadge from "$lib/components/garden/RipenessBadge.svelte";
	import { formatRelativeDate } from "$lib/utils/date";
	import { fly } from "svelte/transition";
	import { Map, FolderOpen, Compass, Sprout, Library, Sparkles } from "@lucide/svelte";
	import type { PostFrontmatter } from "$lib/types";

	interface Props {
		data: {
			mocs: Array<{ name: string; count: number; href: string }>;
			postsByKind: {
				note: PostFrontmatter[];
				essay: PostFrontmatter[];
				tutorial: PostFrontmatter[];
				thought: PostFrontmatter[];
			};
			postsByRipeness: {
				seed: PostFrontmatter[];
				root: PostFrontmatter[];
				fruit: PostFrontmatter[];
			};
			freshPosts: PostFrontmatter[];
			series: Array<{ name: string; posts: PostFrontmatter[] }>;
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
				<Map class="text-primary mr-2 inline-block -translate-y-2" size={48} strokeWidth={2.5} />
				Explore o Jardim
			</h1>
			<p class="text-muted text-3xl leading-relaxed font-light">
				Este é um jardim de ideias em crescimento. Algumas notas ainda estão brotando, outras já
				deram frutos. Escolha um caminho e caminhe sem pressa.
			</p>
		</div>
	</Container>
</Section>

<!-- SECTION B: Areas of Interest (MOCs) -->
{#if data.mocs.length > 0}
	<Section class="py-12">
		<Container size="lg">
			<div in:fly={{ y: 30, duration: 800, delay: 200 }}>
				<SectionHeader
					icon={FolderOpen}
					title="Áreas de Interesse"
					subtitle="Explore por grandes temas"
				/>
				<Grid cols={2} gap="md">
					{#each data.mocs as moc, i (moc.name)}
						<div in:fly={{ y: 20, duration: 600, delay: 300 + i * 80 }}>
							<MOCCard name={moc.name} count={moc.count} href={moc.href} />
						</div>
					{/each}
				</Grid>
			</div>
		</Container>
	</Section>
{/if}

<!-- SECTION C: Reading Paths (By Kind) -->
<Section class="py-12">
	<Container size="lg">
		<div in:fly={{ y: 30, duration: 800, delay: 400 }}>
			<SectionHeader icon={Compass} title="Tipos de Conteúdo" subtitle="Explore por formato" />
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<!-- Column 1: Essays & Thoughts -->
				<div class="flex flex-col gap-4">
					<h3 class="font-heading text-text border-border border-b-2 pb-2 text-2xl font-semibold">
						Ensaios & Reflexões
					</h3>
					{#if data.postsByKind.essay.length > 0 || data.postsByKind.thought.length > 0}
						<ul class="m-0 flex list-none flex-col gap-3 p-0">
							{#each [...data.postsByKind.essay, ...data.postsByKind.thought] as post (post.slug)}
								<li class="group relative pl-5">
									<span
										class="text-primary absolute left-0 font-bold transition-transform group-hover:translate-x-1"
										>→</span
									>
									<a
										href="/posts/{post.slug}"
										class="text-text hover:text-primary decoration-primary/30 decoration-2 underline-offset-4 transition-colors hover:underline"
									>
										{post.title}
									</a>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="text-muted text-sm italic">Nenhum ensaio ainda.</p>
					{/if}
				</div>

				<!-- Column 2: Tutorials -->
				<div class="flex flex-col gap-4">
					<h3 class="font-heading text-text border-border border-b-2 pb-2 text-2xl font-semibold">
						Tutoriais e Guias
					</h3>
					{#if data.postsByKind.tutorial.length > 0}
						<ul class="m-0 flex list-none flex-col gap-3 p-0">
							{#each data.postsByKind.tutorial as post (post.slug)}
								<li class="group relative pl-5">
									<span
										class="text-primary absolute left-0 font-bold transition-transform group-hover:translate-x-1"
										>→</span
									>
									<a
										href="/posts/{post.slug}"
										class="text-text hover:text-primary decoration-primary/30 decoration-2 underline-offset-4 transition-colors hover:underline"
									>
										{post.title}
									</a>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="text-muted text-sm italic">Nenhum tutorial ainda.</p>
					{/if}
				</div>

				<!-- Column 3: Notes -->
				<div class="flex flex-col gap-4">
					<h3 class="font-heading text-text border-border border-b-2 pb-2 text-2xl font-semibold">
						Notas Rápidas
					</h3>
					{#if data.postsByKind.note.length > 0}
						<ul class="m-0 flex list-none flex-col gap-3 p-0">
							{#each data.postsByKind.note as post (post.slug)}
								<li class="group relative pl-5">
									<span
										class="text-primary absolute left-0 font-bold transition-transform group-hover:translate-x-1"
										>→</span
									>
									<a
										href="/posts/{post.slug}"
										class="text-text hover:text-primary decoration-primary/30 decoration-2 underline-offset-4 transition-colors hover:underline"
									>
										{post.title}
									</a>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="text-muted text-sm italic">Nenhuma nota ainda.</p>
					{/if}
				</div>
			</div>
		</div>
	</Container>
</Section>

<!-- SECTION D: Ripeness -->
<Section class="bg-surface-elevated/50 relative overflow-hidden py-12">
	<div class="bg-grid-pattern pointer-events-none absolute inset-0 opacity-[0.03]"></div>
	<Container size="lg">
		<div in:fly={{ y: 30, duration: 800, delay: 600 }}>
			<SectionHeader
				icon={Sprout}
				title="Estágio de Maturação"
				subtitle="Navegue pelas notas conforme seu estado de crescimento"
			/>
			<RipenessTabs posts={data.postsByRipeness} />
		</div>
	</Container>
</Section>

<!-- SECTION E: Special Series -->
{#if data.series.length > 0}
	<Section class="py-12">
		<Container size="lg">
			<div in:fly={{ y: 30, duration: 800, delay: 800 }}>
				<SectionHeader icon={Library} title="Séries Especiais" subtitle="Coleções organizadas" />
				<div class="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
					{#each data.series as serie, i (serie.name)}
						<div
							class="bg-surface border-border rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-md"
							in:fly={{ y: 20, duration: 600, delay: 900 + i * 80 }}
						>
							<h3
								class="font-heading text-text border-primary mb-6 border-b-2 pb-3 text-2xl font-bold"
							>
								{serie.name}
							</h3>
							<ol class="m-0 flex list-none flex-col gap-3 p-0">
								{#each serie.posts as post (post.slug)}
									<li class="m-0">
										<a
											href="/posts/{post.slug}"
											class="hover:bg-action-hover group flex items-center gap-3 rounded-md p-2 transition-colors"
										>
											<span
												class="bg-primary text-primary-contrast flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
												>{post.series?.order || 0}</span
											>
											<span
												class="text-text group-hover:text-primary flex-1 text-base transition-colors"
												>{post.title}</span
											>
										</a>
									</li>
								{/each}
							</ol>
						</div>
					{/each}
				</div>
			</div>
		</Container>
	</Section>
{/if}

<!-- SECTION F: Freshness -->
{#if data.freshPosts.length > 0}
	<Section class="py-12">
		<Container size="lg">
			<div in:fly={{ y: 30, duration: 800, delay: 1000 }}>
				<SectionHeader
					icon={Sparkles}
					title="Recém-Atualizadas"
					subtitle="As notas mais frescas do jardim"
				/>
				<div class="flex flex-col gap-4">
					{#each data.freshPosts as post, i (post.slug)}
						<a
							href="/posts/{post.slug}"
							class="bg-surface border-border hover:border-border-vivid flex items-center gap-4 rounded-lg border p-5 no-underline transition-all hover:translate-x-1 hover:shadow-md"
							in:fly={{ y: 20, duration: 600, delay: 1100 + i * 80 }}
						>
							<div class="min-w-0 flex-1">
								<h3 class="text-text mb-2 text-xl leading-tight font-semibold">{post.title}</h3>
								<div class="text-muted flex items-center gap-3 text-xs">
									<span class="font-bold tracking-wider uppercase">
										{post.updatedAt ? formatRelativeDate(post.updatedAt) : ""}
									</span>
									<span class="text-border-vivid">•</span>
									<RipenessBadge ripeness={post.ripeness} showLabel={false} />
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</Container>
	</Section>
{/if}
