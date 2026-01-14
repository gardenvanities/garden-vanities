<script lang="ts">
	import SEO from "$lib/components/core/SEO.svelte";
	import Container from "$lib/components/layout/Container.svelte";
	import Section from "$lib/components/layout/Section.svelte";
	import Grid from "$lib/components/layout/Grid.svelte";
	import { FolderOpen, ArrowRight } from "@lucide/svelte";
	import { fly } from "svelte/transition";

	let { data } = $props();
</script>

<SEO
	title="Tópicos (Atlas) | Garden of Vanities"
	description="Mapa de todos os tópicos e áreas de interesse do jardim."
/>

<Section class="py-12">
	<Container size="lg">
		<div in:fly={{ y: 20, duration: 800 }}>
			<div class="mb-12 text-center">
				<h1 class="font-heading text-text mb-4 text-5xl font-bold">Atlas do Jardim</h1>
				<p class="text-muted text-xl">Navegue por todas as áreas de interesse cultivadas.</p>
			</div>

			<Grid cols={3} gap="lg">
				{#each data.topics as topic, i (topic.name)}
					<a
						href={topic.href}
						in:fly={{ y: 20, duration: 800, delay: i * 50 }}
						class="bg-surface group border-border hover:border-border-vivid relative flex flex-col gap-4 rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
					>
						<div class="flex items-center justify-between">
							<div
								class="bg-primary/5 text-primary flex h-10 w-10 items-center justify-center rounded-lg"
							>
								<FolderOpen size={20} />
							</div>
							<span class="bg-surface-elevated text-muted rounded-full px-3 py-1 text-xs font-bold">
								{topic.count}
							</span>
						</div>

						<div>
							<h3
								class="font-heading text-text group-hover:text-primary text-xl leading-tight font-bold transition-colors"
							>
								{topic.name}
							</h3>
						</div>

						<div class="text-muted mt-auto flex items-center gap-2 text-xs font-medium">
							<span>Explorar tópico</span>
							<ArrowRight size={14} class="transition-transform group-hover:translate-x-1" />
						</div>
					</a>
				{/each}
			</Grid>
		</div>
	</Container>
</Section>
