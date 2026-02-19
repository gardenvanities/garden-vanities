<script lang="ts">
	import "../app.css";
	import { onMount } from "svelte";
	import { afterNavigate } from "$app/navigation";
	import Lenis from "lenis";
	import Sidebar from "$lib/core/navigation/Sidebar.svelte";
	import FloatingNav from "$lib/core/navigation/FloatingNav.svelte";
	import Footer from "$lib/core/Footer.svelte";
	import { scrollState } from "$lib/stores/scroll.svelte";
	import { ui } from "$lib/stores/ui.svelte";
	import { cn } from "$lib/shared/merge-class";

	const { children } = $props();

	let isExpanded = $derived(ui.sidebarExpanded);

	afterNavigate(() => {
		scrollState.instance?.scrollTo(0, { immediate: true });
	});

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
			scrollState.instance = null;
		};
	});
</script>

<div class="flex min-h-dvh">
	<Sidebar />

	<div
		class={cn(
			"flex min-w-0 flex-1 flex-col transition-[margin-left] duration-base ease-entrance md:ml-12",
			isExpanded && "md:ml-70"
		)}
	>
		<main class="flex-1 pb-8 max-md:pb-[calc(var(--space-16)+var(--space-3))]">
			{@render children?.()}
		</main>

		<Footer />
	</div>

	<FloatingNav />
</div>
