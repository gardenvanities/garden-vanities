<script lang="ts">
	import { Layers } from "@lucide/svelte";
	import type { SerieNavigation } from "$lib/types";

	interface Props {
		navigation: SerieNavigation;
		seriesName?: string;
	}

	let { navigation, seriesName }: Props = $props();
</script>

{#if navigation && (navigation.prev || navigation.next)}
	<footer class="border-border-default mt-16 border-t pt-12">
		{#if seriesName}
			<div
				class="text-text-muted mb-6 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase"
			>
				<Layers size={14} class="opacity-50" />
				Continuação da Série: <span class="text-brand-primary">{seriesName}</span>
			</div>
		{/if}

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{#if navigation.prev}
				<a
					href="/posts/{navigation.prev.slug}"
					class="group border-border-default hover:border-brand-primary/30 flex flex-col gap-2 rounded-lg border p-4 transition-all hover:bg-white/5"
				>
					<span
						class="text-text-muted group-hover:text-brand-primary text-[10px] font-bold tracking-wider uppercase"
					>
						Anterior
					</span>
					<span
						class="text-text-heading group-hover:text-brand-primary/90 text-sm font-medium transition-colors"
					>
						{navigation.prev.title}
					</span>
				</a>
			{:else}
				<div class="hidden sm:block"></div>
			{/if}

			{#if navigation.next}
				<a
					href="/posts/{navigation.next.slug}"
					class="group border-border-default hover:border-brand-primary/30 flex flex-col gap-2 rounded-lg border p-4 text-right transition-all hover:bg-white/5"
				>
					<span
						class="text-text-muted group-hover:text-brand-primary text-[10px] font-bold tracking-wider uppercase"
					>
						Próximo
					</span>
					<span
						class="text-text-heading group-hover:text-brand-primary/90 text-sm font-medium transition-colors"
					>
						{navigation.next.title}
					</span>
				</a>
			{/if}
		</div>
	</footer>
{/if}
