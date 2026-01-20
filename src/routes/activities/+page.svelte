<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Section from "$lib/layout/Section.svelte";
	import Container from "$lib/layout/Container.svelte";
	import { Clock } from "@lucide/svelte";

	let { data } = $props();

	const PageContent = data.content;

	const formatDate = (dateStr?: string) => {
		if (!dateStr) return null;
		return new Date(dateStr).toLocaleDateString("pt-BR", {
			month: "long",
			year: "numeric"
		});
	};
</script>

<SEO
	title="Agora | Garden of Vanities"
	description="O que estou fazendo neste momento da minha vida: foco atual, leituras, projetos e pensamentos."
/>

<Section class="py-16 md:py-24">
	<Container size="sm">
		<header class="mb-12 text-center">
			<h1
				class="text-text mb-4 font-serif text-4xl font-bold tracking-tight sm:text-5xl"
			>
				{data.metadata.title}
			</h1>

			{#if data.metadata.updatedAt}
				<div
					class="text-muted inline-flex items-center gap-2 text-sm"
				>
					<Clock size={14} />
					<span>Atualizado em {formatDate(data.metadata.updatedAt)}</span>
				</div>
			{/if}
		</header>

		<article class="prose prose-neutral dark:prose-invert max-w-none">
			{#if PageContent}
				<PageContent />
			{/if}
		</article>
	</Container>
</Section>
