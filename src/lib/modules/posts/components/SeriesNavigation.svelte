<script lang="ts">
	import type { SerieNavigation } from "$lib/modules/posts/types";
	import { page } from "$app/state";
	import PostListItem from "$lib/modules/posts/components/PostListItem.svelte";

	interface Props {
		navigation?: SerieNavigation | undefined;
	}

	let { navigation }: Props = $props();

	let list = $derived(navigation?.list ?? []);
</script>

{#if navigation && list.length > 0}
	<div class="mt-24 space-y-8">
		<h3
			class="font-heading text-text flex items-center justify-between text-lg font-semibold tracking-tight"
		>
			<span>Nesta Série</span>
			<span class="text-muted text-sm font-normal tracking-normal normal-case">
				{navigation.current} de {navigation.total}
			</span>
		</h3>

		<div class="divide-border border-border/50 flex flex-col divide-y border-t border-b">
			{#each list as item, i (item.slug || i)}
				{@const isActive = item.slug ? page.url.pathname.includes(item.slug) : false}

				<div class="relative">
					<PostListItem
						post={item}
						active={isActive}
						showSummary={true}
						seriesBadge={item.series?.order ? `Parte ${item.series.order}` : undefined}
					/>

					
					{#if isActive}
						<div class="pointer-events-none absolute top-5 right-5 z-20">
							<span class="relative flex h-2.5 w-2.5">
								<span
									class="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
								></span>
								<span
									class="bg-primary relative inline-flex h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]"
								></span>
							</span>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}
