<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { page } from "$app/stores";

	let progress = $state(0);

	// Only show on post pages (e.g. /posts/slug) and not indexes
	const isPostPage = $derived(
		$page.url.pathname.startsWith("/posts/") && $page.url.pathname !== "/posts"
	);

	let isVisible = $state(false);

	function updateProgress() {
		// Optimization: Don't calculate if we aren't on a post page
		if (!isPostPage) {
			isVisible = false;
			return;
		}

		const scrollTop = window.scrollY;
		const docHeight = document.documentElement.scrollHeight;
		const winHeight = window.innerHeight;

		if (docHeight > winHeight + 100) {
			const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
			progress = Math.min(100, Math.max(0, scrollPercent));
			isVisible = scrollTop > 100;
		} else {
			isVisible = false;
		}
	}

	onMount(() => {
		window.addEventListener("scroll", updateProgress);
		// Also update when page changes
		const unsubscribe = page.subscribe(() => {
			// Small timeout to allow DOM to update height
			setTimeout(updateProgress, 100);
		});

		updateProgress();

		return () => {
			window.removeEventListener("scroll", updateProgress);
			unsubscribe();
		};
	});
</script>

{#if isVisible}
	<div
		class="fixed top-0 left-0 h-full w-[4px] max-md:hidden"
		style="z-index: 100;"
		transition:fade={{ duration: 200 }}
	>
		<!-- Track (Background) -->
		<div class="h-full w-full" style="background-color: var(--color-border); opacity: 0.3;"></div>

		<!-- Progress Fill -->
		<div
			class="absolute top-0 left-0 w-full transition-all duration-150 ease-out"
			style="height: {progress}%; background-color: var(--color-primary);"
		>
			<!-- Glow effect at the bottom tip of the bar -->
			<div
				class="absolute bottom-0 left-0 h-4 w-4 -translate-x-1.5 blur-md"
				style="background-color: var(--color-primary);"
			></div>
		</div>
	</div>

	<!-- Mobile fallback -->
	<div
		class="fixed top-0 left-0 h-[3px] w-full md:hidden"
		style="z-index: 100; background-color: var(--color-surface);"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="h-full transition-all duration-150 ease-out"
			style="width: {progress}%; background-color: var(--color-primary);"
		></div>
	</div>
{/if}
