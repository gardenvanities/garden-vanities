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
			<!-- Premium Page Header -->
			<header class="mb-16 flex flex-col items-center text-center md:mb-20">
				<div class="flex flex-col items-center gap-4">
					<div
						class="bg-primary/8 text-primary mb-2 flex h-12 w-12 items-center justify-center rounded-full"
						in:fade={{ duration: 600, delay: 200 }}
					>
						<Folder size={20} strokeWidth={1.5} />
					</div>
					<h1
						class="font-heading text-text my-0 text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em]"
						in:fly={{ y: 15, duration: 700, delay: 100 }}
					>
						Coleções
					</h1>
					<div
						class="bg-linear-to-r from-transparent via-primary/50 to-transparent my-2 h-0.5 w-16"
						in:fade={{ duration: 800, delay: 300 }}
					></div>
					<p
						class="text-muted my-0 max-w-[32ch] text-lg font-normal tracking-[0.01em]"
						in:fly={{ y: 10, duration: 600, delay: 250 }}
					>
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


