<script lang="ts">
	import "../app.css";
	import { onMount } from "svelte";
	import { onNavigate } from "$app/navigation";
	import Lenis from "lenis";
	import FloatingNav from "$lib/components/core/FloatingNav.svelte";

	import ReadingProgress from "$lib/components/core/ReadingProgress.svelte";
	import Footer from "$lib/components/core/Footer.svelte";
	import HoverPreview from "$lib/components/garden/HoverPreview.svelte";
	import LinkPreviewDelegator from "$lib/components/garden/LinkPreviewDelegator.svelte";

	const { children, data } = $props();

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

<ReadingProgress />

<div
	class="text-text-body bg-surface-base selection:bg-brand-primary/20 selection:text-brand-primary flex min-h-screen flex-col font-sans antialiased"
>
	<LinkPreviewDelegator>
		<main class="grow pb-24">
			{@render children?.()}
		</main>
	</LinkPreviewDelegator>

	<Footer />

	<FloatingNav searchIndex={data.searchIndex} />
	<HoverPreview />
</div>
