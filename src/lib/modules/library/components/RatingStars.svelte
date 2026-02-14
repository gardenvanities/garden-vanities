<script lang="ts">
	import { Star } from "@lucide/svelte";

	interface Props {
		rating: number; 
		max?: number;
		size?: "sm" | "md";
	}

	let { rating = 0, max = 5, size = 'md' }: Props = $props();

	let iconSize = $derived(size === "sm" ? 12 : 16);
</script>

<div class="flex items-center gap-0.5" aria-label="{rating} de {max} estrelas">
	
	<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
	{#each Array(max) as _, i (i)}
		<Star
			size={iconSize}
			class={i < rating ? "fill-amber-400 text-amber-400" : "fill-transparent text-white/20"}
		/>
	{/each}
</div>
