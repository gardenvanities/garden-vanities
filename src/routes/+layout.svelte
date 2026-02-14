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

<div class="app-layout">
	<Sidebar />

	<div class="app-content" class:app-content--sidebar-expanded={isExpanded}>
		<main class="app-main">
			{@render children?.()}
		</main>

		<Footer />
	</div>

	<FloatingNav />
</div>

<style>
	@layer components {
		.app-layout {
			display: flex;
			min-height: 100dvh;
		}

		.app-content {
			flex: 1;
			min-width: 0;
			display: flex;
			flex-direction: column;
			transition: margin-left var(--motion-base) var(--motion-ease-out-quint);
		}

		/* Mobile: no margin, full width */
		@media (max-width: 767px) {
			.app-content {
				margin-left: 0;
			}
		}

		/* Tablet: collapsed sidebar offset */
		@media (min-width: 768px) and (max-width: 1023px) {
			.app-content {
				margin-left: 64px;
			}

			.app-content--sidebar-expanded {
				margin-left: 260px;
			}
		}

		/* Desktop */
		@media (min-width: 1024px) {
			.app-content {
				margin-left: 64px;
			}

			.app-content--sidebar-expanded {
				margin-left: 260px;
			}
		}

		.app-main {
			flex: 1;
			padding-bottom: var(--space-8);
		}
	}
</style>
