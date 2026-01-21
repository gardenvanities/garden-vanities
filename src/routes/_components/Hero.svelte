<script lang="ts">
	import Container from "$lib/layout/Container.svelte";
	import { fly, fade } from "svelte/transition";
</script>

<section
	class="relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden py-16 md:py-20"
>
	<!-- Subtle Background Effects -->
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<div
			class="absolute top-1/2 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[150px]"
		></div>
	</div>

	<Container size="xl">
		<div class="relative z-10 flex w-full flex-col items-center justify-center">
			<!-- Quote Block -->
			<blockquote
				class="text-center"
				in:fly={{ y: 30, duration: 1000, delay: 0 }}
			>
					<!-- Main Quote Text -->
				<p
					class="hero-silver-gradient font-heading mx-auto max-w-5xl text-2xl font-medium leading-snug tracking-tight md:text-3xl lg:text-4xl xl:text-5xl"
					in:fly={{ y: 20, duration: 800, delay: 200 }}
				>
					Há uma vaidade na dor e uma vaidade ainda maior na sabedoria.
					Ambas nos fazem acreditar que somos especiais.
				</p>

				<!-- Author Attribution -->
				<footer
					class="mt-6 md:mt-8"
					in:fade={{ duration: 600, delay: 600 }}
				>
					<cite class="text-muted not-italic">
						<span class="text-sm tracking-widest uppercase md:text-base">— Aldous Huxley</span>
						<span class="mt-1 block text-xs opacity-60 md:text-sm">Contraponto</span>
					</cite>
				</footer>
			</blockquote>
		</div>
	</Container>
</section>

<style>
	.hero-silver-gradient {
		background: linear-gradient(
			135deg,
			var(--hero-gradient-1, oklch(0.85 0 0)) 0%,
			var(--hero-gradient-2, oklch(0.6 0 0)) 25%,
			var(--hero-gradient-3, oklch(0.9 0 0)) 50%,
			var(--hero-gradient-4, oklch(0.55 0 0)) 75%,
			var(--hero-gradient-5, oklch(0.8 0 0)) 100%
		);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-size: 200% 200%;
		animation: shimmer 8s ease-in-out infinite;
	}

	/* Light mode colors */
	:global(:root) {
		--hero-gradient-1: oklch(0.35 0 0);
		--hero-gradient-2: oklch(0.2 0 0);
		--hero-gradient-3: oklch(0.4 0 0);
		--hero-gradient-4: oklch(0.15 0 0);
		--hero-gradient-5: oklch(0.3 0 0);
	}

	/* Dark mode colors */
	:global(.dark) {
		--hero-gradient-1: oklch(0.85 0 0);
		--hero-gradient-2: oklch(0.6 0 0);
		--hero-gradient-3: oklch(0.9 0 0);
		--hero-gradient-4: oklch(0.55 0 0);
		--hero-gradient-5: oklch(0.8 0 0);
	}

	@keyframes shimmer {
		0%, 100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}
</style>
