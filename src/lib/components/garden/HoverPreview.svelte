<script lang="ts">
	import { hoverPreview } from "$lib/stores/hover-preview.svelte";
	import { fade, fly } from "svelte/transition";
	import { Calendar } from "@lucide/svelte";

	// Calculate position styles
	const positionStyles = $derived(`top: ${hoverPreview.y + 20}px; left: ${hoverPreview.x}px;`);
</script>

{#if hoverPreview.isOpen && hoverPreview.slug}
	<div
		class="bg-surface border-border pointer-events-none fixed z-50 w-80 -translate-x-1/2 rounded-xl border p-4 shadow-2xl backdrop-blur-md"
		style={positionStyles}
		transition:fade={{ duration: 200 }}
	>
		{#if hoverPreview.loading}
			<div class="flex animate-pulse flex-col gap-3">
				<div class="bg-text/10 h-4 w-3/4 rounded"></div>
				<div class="bg-text/5 h-3 w-full rounded"></div>
				<div class="bg-text/5 h-3 w-5/6 rounded"></div>
			</div>
		{:else if hoverPreview.error}
			<p class="text-sm text-red-400">{hoverPreview.error}</p>
		{:else if hoverPreview.data}
			<div in:fly={{ y: 5, duration: 300 }}>
				<h4 class="font-display text-text mb-2 text-lg leading-tight font-bold">
					{hoverPreview.data.title}
				</h4>

				<div class="text-muted mb-3 flex items-center gap-3 text-xs">
					{#if hoverPreview.data.publishedAt}
						<span class="flex items-center gap-1">
							<Calendar size={12} />
							{new Date(hoverPreview.data.publishedAt).toLocaleDateString("pt-BR", {
								day: "numeric",
								month: "short",
								year: "numeric"
							})}
						</span>
					{/if}
				</div>

				{#if hoverPreview.data.excerpt}
					<p class="text-text line-clamp-3 text-sm leading-relaxed">
						{hoverPreview.data.excerpt}
					</p>
				{/if}
			</div>
		{/if}
	</div>
{/if}
