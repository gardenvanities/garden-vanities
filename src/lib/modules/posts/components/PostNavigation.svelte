<script lang="ts">
	import { Layers, ArrowLeft, ArrowRight } from "@lucide/svelte";
	import type { SerieNavigation } from "$lib/modules/posts/types";

	interface Props {
		navigation?: SerieNavigation | undefined;
		seriesSlug?: string;
	}

	let { navigation, seriesSlug }: Props = $props();
</script>

{#if navigation && (navigation.prev || navigation.next)}
	<footer class="mt-20 pt-16">
		{#if seriesSlug}
			<div class="mb-10 flex justify-center">
				<div
					class="border-border/50 bg-surface/40 text-muted-foreground hover:border-primary/30 hover:bg-surface/60 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-widest uppercase backdrop-blur-md transition-colors"
				>
					<Layers size={14} class="text-primary/70" />
					<span>
						Série: <a
							href="/series/{seriesSlug}"
							class="text-text hover:text-primary transition-colors">{seriesSlug}</a
						>
					</span>
				</div>
			</div>
		{/if}

		<nav class="grid grid-cols-1 gap-6 md:grid-cols-2" aria-label="Navegação entre posts">
			<!-- PREVIOUS POST -->
			{#if navigation.prev}
				<a
					href="/posts/{navigation.prev.slug}"
					class="group border-border/40 bg-surface/20 hover:border-primary/30 hover:bg-surface/40 hover:shadow-primary/5 relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 backdrop-blur-md transition-all hover:shadow-xl"
				>
					<!-- Hover Glow Effect -->
					<div
						class="bg-primary/10 absolute -top-16 -left-16 h-40 w-40 rounded-full opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-100"
					></div>

					<div class="relative z-10">
						<div
							class="text-muted-foreground/80 group-hover:text-primary mb-3 flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase transition-colors"
						>
							<ArrowLeft
								size={16}
								class="transition-transform duration-300 group-hover:-translate-x-1"
							/>
							{#if navigation.prev.order}
								<span>Parte {navigation.prev.order}</span>
							{:else}
								<span>Anterior</span>
							{/if}
						</div>

						<h3
							class="text-text group-hover:text-primary text-lg leading-snug font-bold transition-colors"
						>
							{navigation.prev.title}
						</h3>
					</div>

					<div
						class="text-muted-foreground group-hover:text-text/80 relative z-10 mt-6 flex items-center text-xs font-medium transition-colors"
					>
						Ler artigo anterior
					</div>
				</a>
			{:else}
				<div aria-hidden="true" class="hidden md:block"></div>
			{/if}

			<!-- NEXT POST -->
			{#if navigation.next}
				<a
					href="/posts/{navigation.next.slug}"
					class="group border-border/40 bg-surface/20 hover:border-primary/30 hover:bg-surface/40 hover:shadow-primary/5 relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 text-right backdrop-blur-md transition-all hover:shadow-xl"
				>
					<!-- Hover Glow Effect -->
					<div
						class="bg-primary/10 absolute -right-16 -bottom-16 h-40 w-40 rounded-full opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-100"
					></div>

					<div class="relative z-10 flex flex-col items-end">
						<div
							class="text-muted-foreground/80 group-hover:text-primary mb-3 flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase transition-colors"
						>
							{#if navigation.next.order}
								<span>Parte {navigation.next.order}</span>
							{:else}
								<span>Próximo</span>
							{/if}
							<ArrowRight
								size={16}
								class="transition-transform duration-300 group-hover:translate-x-1"
							/>
						</div>

						<h3
							class="text-text group-hover:text-primary text-lg leading-snug font-bold transition-colors"
						>
							{navigation.next.title}
						</h3>
					</div>

					<div
						class="text-muted-foreground group-hover:text-text/80 relative z-10 mt-6 flex items-center justify-end text-xs font-medium transition-colors"
					>
						Ler próximo artigo
					</div>
				</a>
			{/if}
		</nav>
	</footer>
{/if}
