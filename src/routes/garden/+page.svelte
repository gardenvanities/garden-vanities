<script lang="ts">
	import SEO from "$lib/components/core/SEO.svelte";
	import Container from "$lib/components/layout/Container.svelte";
	import Section from "$lib/components/layout/Section.svelte";
	import PostAccordion from "$lib/components/garden/PostAccordion.svelte";
	import RipenessBadge from "$lib/components/garden/RipenessBadge.svelte";
	import { fly } from "svelte/transition";
	import type { PostFrontmatter } from "$lib/types";

	interface Props {
		data: {
			posts: PostFrontmatter[];
			filters: {
				moc: string | null;
				tag: string | null;
				ripeness: string | null;
			};
			availableFilters: {
				mocs: string[];
				tags: string[];
			};
		};
	}

	let { data }: Props = $props();

	let openSlug = $state<string | null>(null);

	// Build page title based on active filters
	const pageTitle = $derived(() => {
		if (data.filters.moc) return `MOC: ${data.filters.moc}`;
		if (data.filters.tag) return `Tag: ${data.filters.tag}`;
		if (data.filters.ripeness) return `Ripeness: ${data.filters.ripeness}`;
		return "Explorar o Jardim";
	});

	const pageSubtitle = $derived(() => {
		const count = data.posts.length;
		return `${count} ${count === 1 ? "nota encontrada" : "notas encontradas"}`;
	});
</script>

<SEO title="{pageTitle()} | Garden of Vanities" type="website" />

<Section class="py-12">
	<Container size="md">
		<!-- Header -->
		<header class="header" in:fly={{ y: 20, duration: 800, delay: 100 }}>
			<div class="header-content">
				<a href="/" class="back-link">← Voltar ao Jardim</a>
				<h1 class="title">{pageTitle()}</h1>
				<p class="subtitle">{pageSubtitle()}</p>
			</div>

			<!-- Active Filters -->
			{#if data.filters.moc || data.filters.tag || data.filters.ripeness}
				<div class="active-filters">
					<span class="filter-label">Filtros ativos:</span>
					{#if data.filters.moc}
						<a href="/garden" class="filter-badge">
							MOC: {data.filters.moc}
							<span class="filter-remove">×</span>
						</a>
					{/if}
					{#if data.filters.tag}
						<a href="/garden" class="filter-badge">
							Tag: {data.filters.tag}
							<span class="filter-remove">×</span>
						</a>
					{/if}
					{#if data.filters.ripeness && (data.filters.ripeness === "seed" || data.filters.ripeness === "root" || data.filters.ripeness === "fruit")}
						<a href="/garden" class="filter-badge">
							<RipenessBadge ripeness={data.filters.ripeness} showLabel={true} />
							<span class="filter-remove">×</span>
						</a>
					{/if}
				</div>
			{/if}
		</header>

		<!-- Posts List -->
		{#if data.posts.length > 0}
			<div class="posts-list">
				{#each data.posts as post, i (post.slug)}
					<div in:fly={{ y: 20, duration: 800, delay: 200 + i * 80 }}>
						<PostAccordion
							{post}
							open={openSlug === post.slug}
							ontoggle={() => (openSlug = openSlug === post.slug ? null : post.slug)}
						/>
					</div>
				{/each}
			</div>
		{:else}
			<div class="empty-state" in:fly={{ y: 20, duration: 800, delay: 200 }}>
				<p>Nenhuma nota encontrada com esses filtros.</p>
				<a href="/garden" class="clear-filters">Limpar filtros</a>
			</div>
		{/if}
	</Container>
</Section>

<style>
	/* Header */
	.header {
		margin-bottom: var(--space-10);
	}

	.header-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-muted);
		text-decoration: none;
		font-size: var(--type-0);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 600;
		transition: color var(--motion-fast) var(--motion-ease);
	}

	.back-link:hover {
		color: var(--color-primary);
	}

	.title {
		font-family: var(--font-heading);
		font-size: var(--type-5);
		font-weight: 700;
		color: var(--color-text);
		margin: 0;
		line-height: var(--line-height-heading);
	}

	.subtitle {
		font-size: var(--type-1);
		color: var(--color-muted);
		margin: 0;
	}

	/* Active Filters */
	.active-filters {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
		margin-top: var(--space-4);
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-border);
	}

	.filter-label {
		font-size: var(--type-0);
		color: var(--color-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 600;
	}

	.filter-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: var(--color-surface);
		border: 1px solid var(--color-border-vivid);
		border-radius: var(--radius-1);
		font-size: var(--type-0);
		color: var(--color-text);
		text-decoration: none;
		transition: all var(--motion-fast) var(--motion-ease);
	}

	.filter-badge:hover {
		background: var(--color-action-hover);
		border-color: var(--color-primary);
	}

	.filter-remove {
		font-size: 1.25rem;
		line-height: 1;
		color: var(--color-muted);
	}

	/* Posts List */
	.posts-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-4);
		padding: var(--space-10);
		text-align: center;
	}

	.empty-state p {
		font-size: var(--type-2);
		color: var(--color-muted);
		margin: 0;
	}

	.clear-filters {
		display: inline-flex;
		align-items: center;
		padding: var(--space-3) var(--space-5);
		background: var(--color-primary);
		color: var(--color-primary-contrast);
		text-decoration: none;
		border-radius: var(--radius-2);
		font-weight: 600;
		transition: all var(--motion-base) var(--motion-ease);
	}

	.clear-filters:hover {
		background: var(--color-accent);
		box-shadow: var(--shadow-2);
	}
</style>
