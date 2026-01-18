<script lang="ts">
	import { Layers } from "@lucide/svelte";
	import type { SerieNavigation } from "$lib/modules/posts/types";

	interface Props {
		navigation: SerieNavigation;
		seriesName?: string;
	}

	let { navigation, seriesName }: Props = $props();
</script>

{#if navigation && (navigation.prev || navigation.next)}
	<footer class="border-border mt-16 border-t pt-12">
		{#if seriesName}
			<div
				class="text-muted mb-6 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase"
			>
				<Layers size={14} class="opacity-50" />
				Continuação da Série: <span class="text-primary">{seriesName}</span>
			</div>
		{/if}

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{#if navigation.prev}
				<a
					href="/posts/{navigation.prev.slug}"
					class="group border-border hover:border-primary/30 hover:bg-action-hover flex flex-col gap-2 rounded-lg border p-4 transition-all"
				>
					<span
						class="text-muted group-hover:text-primary text-[10px] font-bold tracking-wider uppercase"
					>
						Anterior
					</span>
					<span class="text-text group-hover:text-primary/90 text-sm font-medium transition-colors">
						{navigation.prev.title}
					</span>
				</a>
			{:else}
				<div class="hidden sm:block"></div>
			{/if}

			{#if navigation.next}
				<a
					href="/posts/{navigation.next.slug}"
					class="group border-border hover:border-primary/30 hover:bg-action-hover flex flex-col gap-2 rounded-lg border p-4 text-right transition-all"
				>
					<span
						class="text-muted group-hover:text-primary text-[10px] font-bold tracking-wider uppercase"
					>
						Próximo
					</span>
					<span class="text-text group-hover:text-primary/90 text-sm font-medium transition-colors">
						{navigation.next.title}
					</span>
				</a>
			{/if}
		</div>
	</footer>
{/if}
