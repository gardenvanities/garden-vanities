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
		<div class="hero" in:fly={{ y: 30, duration: 1000, delay: 100 }}>
			<h1 class="hero-title">🗺️ Explore o Jardim</h1>
			<p class="hero-subtitle">
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
				<SectionHeader emoji="🗂️" title="Áreas de Interesse" subtitle="Explore por grandes temas" />
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
			<SectionHeader emoji="🧭" title="Tipos de Conteúdo" subtitle="Explore por formato" />
			<div class="curation-grid">
				<!-- Column 1: Essays & Thoughts -->
				<div class="curation-column">
					<h3 class="curation-title">Ensaios & Reflexões</h3>
					{#if data.postsByKind.essay.length > 0 || data.postsByKind.thought.length > 0}
						<ul class="curation-list">
							{#each [...data.postsByKind.essay, ...data.postsByKind.thought] as post (post.slug)}
								<li>
									<a href="/posts/{post.slug}" class="curation-link">{post.title}</a>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="curation-empty">Nenhum ensaio ainda.</p>
					{/if}
				</div>

				<!-- Column 2: Tutorials -->
				<div class="curation-column">
					<h3 class="curation-title">Tutoriais e Guias</h3>
					{#if data.postsByKind.tutorial.length > 0}
						<ul class="curation-list">
							{#each data.postsByKind.tutorial as post (post.slug)}
								<li>
									<a href="/posts/{post.slug}" class="curation-link">{post.title}</a>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="curation-empty">Nenhum tutorial ainda.</p>
					{/if}
				</div>

				<!-- Column 3: Notes -->
				<div class="curation-column">
					<h3 class="curation-title">Notas Rápidas</h3>
					{#if data.postsByKind.note.length > 0}
						<ul class="curation-list">
							{#each data.postsByKind.note as post (post.slug)}
								<li>
									<a href="/posts/{post.slug}" class="curation-link">{post.title}</a>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="curation-empty">Nenhuma nota ainda.</p>
					{/if}
				</div>
			</div>
		</div>
	</Container>
</Section>

<!-- SECTION D: Ripeness - INTERACTIVE (Most Important) -->
<Section class="bg-surface-subtle py-12">
	<Container size="lg">
		<div in:fly={{ y: 30, duration: 800, delay: 600 }}>
			<SectionHeader
				emoji="🌳"
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
				<SectionHeader emoji="📚" title="Séries Especiais" subtitle="Coleções organizadas" />
				<div class="series-grid">
					{#each data.series as serie, i (serie.name)}
						<div class="series-card" in:fly={{ y: 20, duration: 600, delay: 900 + i * 80 }}>
							<h3 class="series-name">{serie.name}</h3>
							<ol class="series-list">
								{#each serie.posts as post (post.slug)}
									<li class="series-item">
										<a href="/posts/{post.slug}" class="series-link">
											<span class="series-order">{post.series?.order || 0}</span>
											<span class="series-title">{post.title}</span>
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

<!-- SECTION F: Freshness (Recently Updated) -->
{#if data.freshPosts.length > 0}
	<Section class="py-12">
		<Container size="lg">
			<div in:fly={{ y: 30, duration: 800, delay: 1000 }}>
				<SectionHeader
					emoji="🌟"
					title="Recém-Atualizadas"
					subtitle="As notas mais frescas do jardim"
				/>
				<div class="fresh-list">
					{#each data.freshPosts as post, i (post.slug)}
						<a
							href="/posts/{post.slug}"
							class="fresh-item"
							in:fly={{ y: 20, duration: 600, delay: 1100 + i * 80 }}
						>
							<div class="fresh-content">
								<h3 class="fresh-title">{post.title}</h3>
								<div class="fresh-meta">
									<span class="fresh-date">
										{post.updatedAt ? formatRelativeDate(post.updatedAt) : ""}
									</span>
									<span class="fresh-separator">•</span>
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

<style>
	/* ═══════════════════════════════════════════════════════════════════════════
     SECTION A: Hero
     ═══════════════════════════════════════════════════════════════════════════ */

	.hero {
		text-align: center;
		max-width: 800px;
		margin: 0 auto;
	}

	.hero-title {
		font-family: var(--font-heading);
		font-size: var(--type-6);
		font-weight: 700;
		color: var(--color-text);
		margin: 0 0 var(--space-6) 0;
		line-height: var(--line-height-heading);
	}

	.hero-subtitle {
		font-size: var(--type-3);
		color: var(--color-muted);
		line-height: var(--line-height-body);
		margin: 0;
		font-weight: 300;
	}

	/* ═══════════════════════════════════════════════════════════════════════════
     SECTION C: Curation
     ═══════════════════════════════════════════════════════════════════════════ */

	.curation-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--space-6);
	}

	.curation-column {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.curation-title {
		font-family: var(--font-heading);
		font-size: var(--type-2);
		font-weight: 600;
		color: var(--color-text);
		margin: 0;
		padding-bottom: var(--space-2);
		border-bottom: 2px solid var(--color-border);
	}

	.curation-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.curation-list li {
		position: relative;
		padding-left: var(--space-4);
	}

	.curation-list li::before {
		content: "→";
		position: absolute;
		left: 0;
		color: var(--color-primary);
		font-weight: 700;
	}

	.curation-link {
		color: var(--color-text);
		text-decoration: none;
		font-size: var(--type-1);
		line-height: var(--line-height-body);
		transition: color var(--motion-fast) var(--motion-ease);
	}

	.curation-link:hover {
		color: var(--color-primary);
		text-decoration: underline;
	}

	.curation-empty {
		font-size: var(--type-0);
		color: var(--color-muted);
		font-style: italic;
		margin: 0;
	}

	/* ═══════════════════════════════════════════════════════════════════════════
     SECTION D: Handled by RipenessTabs component
     ═══════════════════════════════════════════════════════════════════════════ */

	/* Background for ripeness section */
	:global(.bg-surface-subtle) {
		background: oklch(from var(--color-surface) l c h / 0.5);
	}

	/* ═══════════════════════════════════════════════════════════════════════════
     SECTION E: Freshness
     ═══════════════════════════════════════════════════════════════════════════ */

	.fresh-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.fresh-item {
		display: flex;
		align-items: center;
		padding: var(--space-4) var(--space-5);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-2);
		text-decoration: none;
		transition: all var(--motion-base) var(--motion-ease);
	}

	.fresh-item:hover {
		border-color: var(--color-border-vivid);
		box-shadow: var(--shadow-2);
		transform: translateX(4px);
	}

	.fresh-content {
		flex: 1;
		min-width: 0;
	}

	.fresh-title {
		font-size: var(--type-2);
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 var(--space-2) 0;
		line-height: var(--line-height-heading);
	}

	.fresh-meta {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--type-0);
		color: var(--color-muted);
	}

	.fresh-date {
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 600;
	}

	.fresh-separator {
		color: var(--color-border-vivid);
	}

	/* ═══════════════════════════════════════════════════════════════════════════
     SECTION F: Series
     ═══════════════════════════════════════════════════════════════════════════ */

	.series-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: var(--space-6);
	}

	.series-card {
		padding: var(--space-5);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-2);
		box-shadow: var(--shadow-1);
	}

	.series-name {
		font-family: var(--font-heading);
		font-size: var(--type-3);
		font-weight: 700;
		color: var(--color-text);
		margin: 0 0 var(--space-4) 0;
		padding-bottom: var(--space-3);
		border-bottom: 2px solid var(--color-primary);
	}

	.series-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.series-item {
		margin: 0;
	}

	.series-link {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2);
		text-decoration: none;
		border-radius: var(--radius-1);
		transition: all var(--motion-fast) var(--motion-ease);
	}

	.series-link:hover {
		background: var(--color-action-hover);
	}

	.series-order {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		background: var(--color-primary);
		color: var(--color-primary-contrast);
		border-radius: var(--radius-full);
		font-size: var(--type-0);
		font-weight: 700;
		flex-shrink: 0;
	}

	.series-title {
		flex: 1;
		color: var(--color-text);
		font-size: var(--type-1);
		line-height: var(--line-height-body);
	}

	.series-link:hover .series-title {
		color: var(--color-primary);
	}
</style>
