<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import PostListItem from "$lib/modules/posts/components/PostListItem.svelte";
	import PageHeader from "$lib/ui/PageHeader.svelte";
	import { ArrowLeft } from "@lucide/svelte";

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
	<Container size="lg">
		
		<a
			href="/series"
			class="text-muted bg-surface/50 border-border/30 hover:text-primary hover:bg-primary/8 hover:border-primary/20 mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.05em] uppercase transition-all duration-200"
		>
			<ArrowLeft size={14} strokeWidth={2} />
			<span>Séries</span>
		</a>

		<div>
			
			<PageHeader title={data.series.title} description={data.series.description || ""}>
				{#snippet meta()}
					<div class="flex items-center gap-3 text-sm">
						<span
							class="rounded-full px-3 py-1 text-xs font-semibold {statusInfo.class ===
							'status-ongoing'
								? 'bg-primary/12 text-primary'
								: statusInfo.class === 'status-completed'
									? 'bg-[oklch(70%_0.15_145/0.15)] text-[oklch(55%_0.2_145)]'
									: statusInfo.class === 'status-archived'
										? 'bg-white/20 text-white/50'
										: 'bg-[oklch(75%_0.15_85/0.15)] text-[oklch(60%_0.2_85)]'}"
						>
							{statusInfo.text}
						</span>
						<span class="opacity-40 text-white/50">•</span>
						<span class="font-medium text-white/50">
							{data.posts.length}
							{data.posts.length === 1 ? "parte" : "partes"}
						</span>
					</div>
				{/snippet}
			</PageHeader>

			
			<div class="border-border flex flex-col border-t">
				{#each data.posts as post, i (post.slug)}
					<div class="border-border border-b">
						<PostListItem
							{post}
							showSummary={true}
							seriesBadge="Parte {post.series?.order || i + 1}/{data.posts.length}"
						/>
					</div>
				{/each}
			</div>
		</div>
	</Container>
</Section>
