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
		<header class="mb-10 flex flex-col gap-3" in:fly={{ y: 20, duration: 800, delay: 100 }}>
			<div class="flex flex-col gap-3">
				<a
					href="/"
					class="text-muted hover:text-primary inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors"
				>
					← Voltar ao Jardim
				</a>
				<h1 class="font-heading text-text m-0 text-5xl leading-tight font-bold">{pageTitle()}</h1>
				<p class="text-muted m-0 text-lg">{pageSubtitle()}</p>
			</div>

			<!-- Active Filters -->
			{#if data.filters.moc || data.filters.tag || data.filters.ripeness}
				<div class="border-border mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
					<span class="text-muted text-xs font-bold tracking-widest uppercase">Filtros ativos:</span
					>
					{#if data.filters.moc}
						<a
							href="/garden"
							class="border-border-vivid bg-surface text-text hover:border-primary hover:bg-action-hover inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-xs transition-all"
						>
							MOC: {data.filters.moc}
							<span class="text-muted text-xl leading-none">×</span>
						</a>
					{/if}
					{#if data.filters.tag}
						<a
							href="/garden"
							class="border-border-vivid bg-surface text-text hover:border-primary hover:bg-action-hover inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-xs transition-all"
						>
							Tag: {data.filters.tag}
							<span class="text-muted text-xl leading-none">×</span>
						</a>
					{/if}
					{#if data.filters.ripeness && (data.filters.ripeness === "seed" || data.filters.ripeness === "root" || data.filters.ripeness === "fruit")}
						<a
							href="/garden"
							class="border-border-vivid bg-surface text-text hover:border-primary hover:bg-action-hover inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-xs transition-all"
						>
							<RipenessBadge ripeness={data.filters.ripeness} showLabel={true} />
							<span class="text-muted text-xl leading-none">×</span>
						</a>
					{/if}
				</div>
			{/if}
		</header>

		<!-- Posts List -->
		{#if data.posts.length > 0}
			<div class="flex flex-col gap-1">
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
			<div
				class="flex flex-col items-center justify-center gap-4 p-10 text-center"
				in:fly={{ y: 20, duration: 800, delay: 200 }}
			>
				<p class="text-muted m-0 text-xl">Nenhuma nota encontrada com esses filtros.</p>
				<a
					href="/garden"
					class="bg-primary text-primary-contrast hover:bg-accent inline-flex items-center rounded-md px-5 py-3 font-semibold transition-all hover:shadow-md"
					>Limpar filtros</a
				>
			</div>
		{/if}
	</Container>
</Section>
