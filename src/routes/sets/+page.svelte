<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import Grid from "$lib/layout/Grid.svelte";
	import SetCard from "$lib/modules/garden/components/SetCard.svelte";
	import { Folder } from "@lucide/svelte";
	import { fly, fade } from "svelte/transition";

	let { data } = $props();
</script>

<SEO
	title="Sets (Atlas) | Garden of Vanities"
	description="Mapa de todos os sets e áreas de interesse do jardim."
/>

<Section class="py-16 md:py-24">
	<Container size="lg">
		<div in:fly={{ y: 20, duration: 800 }}>
			<!-- Premium Page Header -->
			<header class="page-header mb-16 md:mb-20">
				<div class="header-content">
					<div class="header-icon" in:fade={{ duration: 600, delay: 200 }}>
						<Folder size={20} strokeWidth={1.5} />
					</div>
					<h1 class="header-title" in:fly={{ y: 15, duration: 700, delay: 100 }}>
						Coleções
					</h1>
					<div class="header-line" in:fade={{ duration: 800, delay: 300 }}></div>
					<p class="header-subtitle" in:fly={{ y: 10, duration: 600, delay: 250 }}>
						Áreas de interesse agrupadas por tema
					</p>
				</div>
			</header>

			<Grid cols={3} gap="lg">
				{#each data.sets as set, i (set.slug)}
					<div in:fly={{ y: 20, duration: 800, delay: i * 50 }}>
						<SetCard {set} class="h-96" />
					</div>
				{/each}
			</Grid>
		</div>
	</Container>
</Section>

<style>
	.page-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
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
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background: oklch(from var(--color-primary) l c h / 0.08);
		color: var(--color-primary);
		margin-bottom: 0.5rem;
	}

	.header-title {
		font-family: var(--font-heading);
		font-size: clamp(2.5rem, 6vw, 4rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.1;
		color: var(--color-text);
		margin: 0;
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

	.header-subtitle {
		font-size: 1.125rem;
		color: var(--color-muted);
		font-weight: 400;
		letter-spacing: 0.01em;
		max-width: 32ch;
		margin: 0;
	}
</style>
