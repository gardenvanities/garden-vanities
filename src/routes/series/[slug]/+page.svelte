<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import PostListItem from "$lib/modules/posts/components/PostListItem.svelte";
	import { ArrowLeft } from "@lucide/svelte";
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
	<Container size="lg">
		<!-- Back Link -->
		<a
			href="/series"
			class="text-muted bg-surface/50 border-border/30 hover:text-primary hover:bg-primary/8 hover:border-primary/20 mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.05em] uppercase transition-all duration-200"
			in:fly={{ x: -10, duration: 400 }}
		>
			<ArrowLeft size={14} strokeWidth={2} />
			<span>Séries</span>
		</a>

		<div in:fly={{ y: 20, duration: 800 }}>
			<!-- Premium Series Header -->
			<header class="mb-16 flex flex-col items-center text-center">
				<div class="flex flex-col items-center gap-4">
					<div class="flex items-center gap-3 text-sm" in:fade={{ duration: 500, delay: 150 }}>
						<span
							class="rounded-full px-3 py-1 text-xs font-semibold {statusInfo.class ===
							'status-ongoing'
								? 'bg-primary/12 text-primary'
								: statusInfo.class === 'status-completed'
									? 'bg-[oklch(70%_0.15_145/0.15)] text-[oklch(55%_0.2_145)]'
									: statusInfo.class === 'status-archived'
										? 'bg-muted/20 text-muted'
										: 'bg-[oklch(75%_0.15_85/0.15)] text-[oklch(60%_0.2_85)]'}"
						>
							{statusInfo.text}
						</span>
						<span class="text-muted opacity-40">•</span>
						<span class="text-muted font-medium">
							{data.posts.length}
							{data.posts.length === 1 ? "parte" : "partes"}
						</span>
					</div>

					<h1
						class="font-heading text-text my-2 text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] font-bold tracking-[-0.02em]"
						in:fly={{ y: 15, duration: 700, delay: 100 }}
					>
						{data.series.title}
					</h1>

					{#if data.series.description}
						<p
							class="text-muted my-0 max-w-[48ch] text-lg leading-[1.6] font-normal"
							in:fly={{ y: 10, duration: 600, delay: 250 }}
						>
							{data.series.description}
						</p>
					{/if}
				</div>
			</header>

			<!-- Posts List -->
			<div class="border-border flex flex-col border-t">
				{#each data.posts as post, i (post.slug)}
					<div class="border-border border-b" in:fly={{ y: 10, duration: 400, delay: i * 50 }}>
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
