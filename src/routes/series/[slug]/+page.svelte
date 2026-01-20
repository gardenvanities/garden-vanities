<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import PostListItem from "$lib/modules/posts/components/PostListItem.svelte";
	import { Layers, ArrowLeft } from "@lucide/svelte";
	import { fly, fade } from "svelte/transition";

	let { data } = $props();

	function getStatusLabel(status: string) {
		const labels: Record<string, { text: string; class: string }> = {
			ongoing: { text: "Em andamento", class: "status-ongoing" },
			completed: { text: "Completa", class: "status-completed" },
			archived: { text: "Arquivada", class: "status-archived" },
			draft: { text: "Rascunho", class: "status-draft" }
		};
		return labels[status] || labels.ongoing;
	}

	const statusInfo = $derived(getStatusLabel(data.series.status));
</script>

<SEO
	title="{data.series.title} | Séries do Jardim"
	description={data.series.description ||
		`Uma coleção de notas ordenadas sobre ${data.series.title}.`}
/>

<Section class="py-16 md:py-24">
	<Container size="md">
		<!-- Back Link -->
		<a
			href="/series"
			class="back-link"
			in:fly={{ x: -10, duration: 400 }}
		>
			<ArrowLeft size={14} strokeWidth={2} />
			<span>Séries</span>
		</a>

		<div in:fly={{ y: 20, duration: 800 }}>
			<!-- Premium Series Header -->
			<header class="page-header">
				<div class="header-content">
					<div class="header-icon" in:fade={{ duration: 600, delay: 200 }}>
						<Layers size={24} strokeWidth={1.5} />
					</div>

					<div class="header-meta" in:fade={{ duration: 500, delay: 150 }}>
						<span class="status-badge {statusInfo.class}">
							{statusInfo.text}
						</span>
						<span class="meta-divider">•</span>
						<span class="parts-count">
							{data.posts.length} {data.posts.length === 1 ? "parte" : "partes"}
						</span>
					</div>

					<h1 class="header-title" in:fly={{ y: 15, duration: 700, delay: 100 }}>
						{data.series.title}
					</h1>

					<div class="header-line" in:fade={{ duration: 800, delay: 300 }}></div>

					{#if data.series.description}
						<p class="header-description" in:fly={{ y: 10, duration: 600, delay: 250 }}>
							{data.series.description}
						</p>
					{/if}
				</div>
			</header>

			<!-- Posts List -->
			<div class="posts-list">
				{#each data.posts as post, i (post.slug)}
					<div 
						class="post-item"
						in:fly={{ y: 10, duration: 400, delay: i * 50 }}
					>
						<span class="post-order">
							{String(post.series?.order || i + 1).padStart(2, "0")}
						</span>
						<div class="post-content">
							<PostListItem {post} showSummary={true} />
						</div>
					</div>
				{/each}
			</div>
		</div>
	</Container>
</Section>

<style>
	/* Back Link */
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 2rem;
		padding: 0.5rem 1rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-muted);
		background: oklch(from var(--color-surface) l c h / 0.5);
		border: 1px solid oklch(from var(--color-border) l c h / 0.3);
		transition: all 0.2s ease;
	}

	.back-link:hover {
		color: var(--color-primary);
		background: oklch(from var(--color-primary) l c h / 0.08);
		border-color: oklch(from var(--color-primary) l c h / 0.2);
	}

	/* Page Header */
	.page-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		margin-bottom: 4rem;
	}

	.header-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.header-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 4rem;
		height: 4rem;
		border-radius: 1rem;
		background: oklch(from var(--color-primary) l c h / 0.08);
		color: var(--color-primary);
		margin-bottom: 0.5rem;
	}

	.header-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.875rem;
	}

	.status-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.status-ongoing {
		background: oklch(from var(--color-primary) l c h / 0.12);
		color: var(--color-primary);
	}

	.status-completed {
		background: oklch(70% 0.15 145 / 0.15);
		color: oklch(55% 0.2 145);
	}

	.status-archived {
		background: oklch(from var(--color-muted) l c h / 0.2);
		color: var(--color-muted);
	}

	.status-draft {
		background: oklch(75% 0.15 85 / 0.15);
		color: oklch(60% 0.2 85);
	}

	.meta-divider {
		color: var(--color-muted);
		opacity: 0.4;
	}

	.parts-count {
		color: var(--color-muted);
		font-weight: 500;
	}

	.header-title {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.1;
		color: var(--color-text);
		margin: 0.5rem 0;
	}

	.header-line {
		width: 4rem;
		height: 2px;
		background: linear-gradient(
			90deg,
			transparent,
			oklch(from var(--color-primary) l c h / 0.5),
			transparent
		);
		margin: 0.5rem 0;
	}

	.header-description {
		font-size: 1.125rem;
		line-height: 1.6;
		color: var(--color-muted);
		font-weight: 400;
		max-width: 48ch;
		margin: 0;
	}

	/* Posts List */
	.posts-list {
		display: flex;
		flex-direction: column;
		border-top: 1px solid var(--color-border);
	}

	.post-item {
		display: flex;
		align-items: center;
		border-bottom: 1px solid var(--color-border);
	}

	.post-order {
		width: 3rem;
		flex-shrink: 0;
		text-align: center;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-muted);
		opacity: 0.4;
	}

	.post-content {
		flex: 1;
	}
</style>
