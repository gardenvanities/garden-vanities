<script lang="ts">
	import "../app.css";
	import { onMount } from "svelte";
	import { onNavigate } from "$app/navigation";
	import Lenis from "lenis";
	import FloatingNav from "$lib/core/navigation/FloatingNav.svelte";
	import Footer from "$lib/core/Footer.svelte";
	import { scrollState } from "$lib/stores/scroll.svelte";

	const { children } = $props();

	onMount(() => {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: "vertical",
			gestureOrientation: "vertical",
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 2
		});

		scrollState.instance = lenis;

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => {
			lenis.destroy();
		};
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<div
	class="text-text bg-bg selection:bg-primary/20 selection:text-primary flex min-h-screen flex-col font-sans antialiased"
>
	<main class="grow pb-24">
		{@render children?.()}
	</main>

	<Footer />

	<FloatingNav />
</div>
