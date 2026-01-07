<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	let progress = $state(0);
	let isVisible = $state(false);

	function updateProgress() {
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
		updateProgress();
		return () => window.removeEventListener("scroll", updateProgress);
	});
</script>

{#if isVisible}
	<div
		class="bg-brand-primary/10 fixed top-0 left-0 z-60 h-[2px] w-full"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="bg-brand-primary h-full transition-all duration-150 ease-out"
			style="width: {progress}%"
		></div>
		<!-- Subtle glow -->
		<div
			class="bg-brand-primary absolute top-0 right-0 h-full w-4 blur-sm transition-all duration-150"
			style="left: calc({progress}% - 16px)"
		></div>
	</div>
{/if}
