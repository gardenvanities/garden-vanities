<script lang="ts">

	import ThemeToggle from "$lib/core/theme/ThemeToggle.svelte";
	import { onMount } from "svelte";

	const currentYear = new Date().getFullYear();



	let svgText: SVGTextElement;
	let viewBox = "0 0 0 0";

	onMount(() => {
		const updateBox = () => {
			if (svgText) {
				const { x, y, width, height } = svgText.getBBox();
				
				const padding = 10;
				viewBox = `${x - padding} ${y - padding} ${width + padding * 2} ${height + padding * 2}`;
			}
		};

		document.fonts.ready.then(updateBox);
		updateBox();
	});
</script>

<footer class="bg-bg border-border/30 mt-32 border-t">
	


	
	<div class="w-full px-4 py-8 sm:px-6 sm:py-10">
		<svg
			{viewBox}
			class="text-text block h-auto w-full select-none"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			<text
				bind:this={svgText}
				x="0"
				y="100"
				font-size="140"
				class="font-heading fill-current font-bold tracking-tighter"
			>
				Garden Of Vanities.
			</text>
		</svg>
		<span class="sr-only">Garden Of Vanities.</span>
	</div>

	
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="border-border/30 flex flex-wrap items-center justify-between gap-4 border-t py-5">
			<div class="flex items-center gap-3 sm:gap-4">
				<span class="text-muted/40 text-[10px] sm:text-xs">© {currentYear}</span>
				<div class="bg-border/30 h-3 w-px sm:h-4"></div>
				<span class="text-muted/40 text-[10px] sm:text-xs">SvelteKit</span>
			</div>
			<ThemeToggle />
		</div>
	</div>
</footer>
