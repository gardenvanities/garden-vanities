<script lang="ts">
	import { Star } from "@lucide/svelte";

	interface Props {
		rating: number;
		max?: number;
		size?: "sm" | "md" | "lg";
		interactive?: boolean;
		onRate?: (rating: number) => void;
	}

	let { rating, max = 5, size = "md", interactive = false, onRate }: Props = $props();

	const sizeClasses = {
		sm: "h-3 w-3",
		md: "h-4 w-4",
		lg: "h-5 w-5"
	};

	const gapClasses = {
		sm: "gap-0.5",
		md: "gap-1",
		lg: "gap-1.5"
	};

	const stars = $derived(Array.from({ length: max }, (_, i) => i));

	function handleClick(index: number) {
		if (interactive && onRate) {
			onRate(index + 1);
		}
	}
</script>

<div
	class="flex items-center {gapClasses[size]}"
	role="img"
	aria-label="{rating} de {max} estrelas"
>
	{#each stars as i (i)}
		<button
			type="button"
			onclick={() => handleClick(i)}
			disabled={!interactive}
			class="transition-colors disabled:cursor-default {interactive
				? 'cursor-pointer hover:scale-110'
				: ''}"
		>
			<Star
				class="{sizeClasses[size]} {i < rating
					? 'fill-amber-400 text-amber-400'
					: 'fill-transparent text-neutral-600'}"
			/>
		</button>
	{/each}
</div>
