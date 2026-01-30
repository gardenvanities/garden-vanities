<script lang="ts">
	import type { SerieNavigation } from "$lib/modules/posts/types";
	import { page } from "$app/stores";
	import KindBadge from "$lib/modules/garden/components/KindBadge.svelte";
	import RipenessBadge from "$lib/modules/garden/components/RipenessBadge.svelte";

	interface Props {
		navigation?: SerieNavigation | undefined;
	}

	let { navigation }: Props = $props();

	let list = $derived(navigation?.list ?? []);
</script>

{#if navigation && list.length > 0}
	<div class="mt-24 space-y-8">
		<h3 class="font-heading text-text text-lg font-semibold tracking-tight flex items-center justify-between">
			<span>Nesta Série</span>
			<span class="text-muted text-sm font-normal normal-case tracking-normal">
				{navigation.current} de {navigation.total}
			</span>
		</h3>

		<div class="divide-border flex flex-col divide-y border-t border-b border-border/50">
			{#each list as item, i (item.slug || i)}
				{@const isActive = item.slug ? $page.url.pathname.includes(item.slug) : false}
				
				<div
					class="group relative block w-full text-left transition-all duration-300 transform {isActive
						? 'bg-surface-elevated/40 translate-x-2'
						: 'hover:bg-surface-elevated/10 hover:translate-x-1'}"
				>
					{#if !isActive}
						<a href="/posts/{item.slug}" class="absolute inset-0 z-20">
							<span class="sr-only">Ver artigo {item.title}</span>
						</a>
					{/if}

					<div class="relative flex items-start gap-4 px-4 py-5 md:gap-5">
						<!-- Active Indicator Sidebar -->
						{#if isActive}
							<div
								class="bg-primary absolute top-0 bottom-0 left-0 w-[4px] rounded-r-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
								aria-hidden="true"
							></div>
						{/if}

						<!-- Content -->
						<div class="relative z-10 flex min-w-0 flex-1 flex-col">
							
							<!-- Top Row: Badges -->
							<div class="flex flex-wrap items-center justify-between gap-2 pr-6"> <!-- Added pr-6 to make room for dot -->
								<div class="flex flex-wrap items-center gap-2">
									{#if item.series?.order}
										<span
											class="flex items-center gap-1.5 rounded-sm border border-rose-500/20 bg-rose-500/10 px-2 py-1.5 text-xs font-medium text-rose-100 transition-all duration-300 {isActive ? 'border-rose-500/40 bg-rose-500/20 shadow-sm' : 'group-hover:border-rose-500/30 group-hover:bg-rose-500/20'}"
										>
											<span class="pt-px">Parte {item.series.order}</span>
										</span>
									{/if}
									{#if item.kind}
										<KindBadge kind={item.kind} />
									{/if}
									<RipenessBadge ripeness={item.ripeness} />
								</div>
							</div>

							<!-- Title & Arrow Row -->
							<div class="relative mt-3 flex items-center justify-between gap-4">
								<h3
									class="font-heading my-0 text-base leading-snug font-semibold tracking-tight transition-colors duration-300 md:text-lg {isActive ? 'text-primary' : 'text-text group-hover:text-primary/90'}"
								>
									{item.title}
								</h3>

								<!-- Arrow icon for non-active items -->
								{#if !isActive}
									<div class="flex shrink-0 items-center opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
										<svg
											class="text-primary h-5 w-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
										</svg>
									</div>
								{/if}
							</div>
						</div>

						<!-- Pulsing Dot (Active Only) - Absolute Top Right -->
						{#if isActive}
							<div class="absolute top-5 right-5 z-20">
								<span class="relative flex h-2.5 w-2.5">
									<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
									<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]"></span>
								</span>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>


	</div>
{/if}
