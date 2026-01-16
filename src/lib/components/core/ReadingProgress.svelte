<script lang="ts">
	import { onMount } from "svelte";
	import { fade, scale } from "svelte/transition";
	import { spring } from "svelte/motion";
	import { page } from "$app/stores";

	let { variant = "sidebar" }: { variant?: "floating" | "sidebar" } = $props();

	// Spring physics for smooth progress filling
	let progressSpring = spring(0, {
		stiffness: 0.1,
		damping: 0.4
	});

	let isVisible = $state(false);
	let readingTimeMinutes = $state(1);
	let showTime = $state(true); // Toggle between Time Left and Percentage

	// Only show on post pages
	const isPostPage = $derived(
		$page.url.pathname.startsWith("/posts/") && $page.url.pathname !== "/posts"
	);

	function calculateReadingTime() {
		// Try to find the main article content
		// Prioritizes <article>, then main layout div, then body fallback
		const article = document.querySelector("article") || document.querySelector(".prose") || document.body;
		if (article) {
			const text = article.innerText;
			const wpm = 200; // Average reading speed
			const words = text.trim().split(/\s+/).length;
			readingTimeMinutes = Math.max(1, Math.ceil(words / wpm));
		}
	}

	function updateProgress() {
		if (!isPostPage) {
			isVisible = false;
			return;
		}

		// Find the article content element specifically
		const articleEl = document.getElementById("article-content") || document.querySelector("article.prose");
		
		if (!articleEl) {
			isVisible = variant === "sidebar";
			return;
		}

		const rect = articleEl.getBoundingClientRect();
		const articleTop = rect.top + window.scrollY;
		const articleHeight = rect.height;
		const scrollTop = window.scrollY;
		const winHeight = window.innerHeight;

		// Calculate progress based on article element position
		// Progress starts when article enters viewport, ends when article bottom leaves viewport
		const startOffset = articleTop - winHeight * 0.2; // Start a bit before article enters
		const endOffset = articleTop + articleHeight - winHeight * 0.8; // End when most of article is scrolled

		let rawPercent = 0;
		if (scrollTop <= startOffset) {
			rawPercent = 0;
		} else if (scrollTop >= endOffset) {
			rawPercent = 100;
		} else {
			rawPercent = ((scrollTop - startOffset) / (endOffset - startOffset)) * 100;
		}

		// Clamp
		const clamped = Math.min(100, Math.max(0, rawPercent));
		
		// Update spring
		progressSpring.set(clamped);

		if (variant === "floating") {
			// Show only when article is in viewport
			const articleInView = rect.top < winHeight && rect.bottom > 0;
			isVisible = articleInView && rawPercent < 100;
		} else {
			// Always visible in sidebar
			isVisible = true;
		}
	}

	function toggleMode() {
		showTime = !showTime;
	}

	onMount(() => {
		calculateReadingTime();
		window.addEventListener("scroll", updateProgress, { passive: true });
		window.addEventListener("resize", updateProgress, { passive: true });

		updateProgress();

		const unsubscribe = page.subscribe(() => {
			progressSpring.set(0, { hard: true });
			// Recalculate time on navigation (small delay for content load)
			setTimeout(() => {
				calculateReadingTime();
				updateProgress();
			}, 200);
		});

		return () => {
			window.removeEventListener("scroll", updateProgress);
			window.removeEventListener("resize", updateProgress);
			unsubscribe();
		};
	});

	// Derived values for display
	const percent = $derived(Math.round($progressSpring));
	const minutesLeft = $derived(Math.max(1, Math.ceil(readingTimeMinutes * (1 - $progressSpring / 100))));
</script>

{#if isVisible}
	<!-- Container: Adjusts based on variant -->
	<div
		class={variant === "floating" 
			? "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-auto"
			: "w-full flex flex-col items-start gap-2 mb-6"
		}
		transition:fade={{ duration: 200 }}
	>
		<!-- 
			THE INSIGHT CAPSULE
			- Glassmorphism
			- Interactive (Click to toggle)
			- Progress Fill Background
		-->
		<button
			onclick={toggleMode}
			class="
				group relative overflow-hidden
				h-10 pl-1 pr-4 rounded-full
				flex items-center gap-3
				bg-surface/60 backdrop-blur-xl
				border border-white/10
				shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2)]
				hover:scale-105 active:scale-95
				transition-all duration-300 ease-out-quint
				cursor-pointer
				{variant === 'sidebar' ? 'w-full' : ''}
			"
			aria-label="Toggle reading progress view"
		>
			<!-- Dynamic Progress Fill (Background Layer) -->
			<div
				class="absolute top-0 left-0 h-full bg-primary/10 transition-all duration-75"
				style="width: {$progressSpring}%;"
			></div>

			<!-- Icon Circle (Mini Progress Indicator) -->
			<div class="relative w-8 h-8 flex items-center justify-center">
				<!-- Track Ring -->
				<svg class="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
					<circle
						cx="18" cy="18" r="14"
						fill="none"
						class="stroke-white/10"
						stroke-width="3"
					/>
					<!-- Progress Ring -->
					<circle
						cx="18" cy="18" r="14"
						fill="none"
						class="stroke-primary transition-all duration-75"
						stroke-width="3"
						stroke-dasharray="88"
						stroke-dashoffset={88 - (88 * $progressSpring) / 100}
						stroke-linecap="round"
					/>
				</svg>
				<!-- Inner Dot/Icon -->
				{#if showTime}
					<div class="absolute inset-0 flex items-center justify-center text-[10px]" in:scale>
						⏳
					</div>
				{:else}
					<div class="absolute inset-0 flex items-center justify-center text-[10px]" in:scale>
						%
					</div>
				{/if}
			</div>

			<!-- Text Info -->
			<div class="flex flex-col items-start justify-center min-w-[60px]">
				<span class="text-xs font-medium text-foreground tabular-nums leading-none">
					{#if showTime}
						{minutesLeft} min left
					{:else}
						{percent}% read
					{/if}
				</span>
				<span class="text-[10px] text-muted leading-none mt-0.5">
					{readingTimeMinutes} min total
				</span>
			</div>
		</button>
	</div>
{/if}
