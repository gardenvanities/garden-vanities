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
				class="text-left"
				in:fly={{ y: 30, duration: 1000, delay: 0 }}
			>
					<!-- Main Quote Text -->
				<p
				<p
					class="hero-silver-gradient font-mono max-w-5xl text-base font-medium leading-snug tracking-tight md:text-lg lg:text-xl"
					in:fly={{ y: 20, duration: 800, delay: 200 }}
				>
				>
					Falei eu com o meu coração, dizendo: Eis que eu me engrandeci, e sobrepujei em sabedoria a todos os que houve antes de mim em Jerusalém; e o meu coração contemplou abundantemente a sabedoria e o conhecimento. E apliquei o meu coração a conhecer a sabedoria e a conhecer os desvios e a loucura, e vim a saber que <strong class="text-primary font-bold">também isto era aflição de espírito.</strong> Porque <strong class="text-primary font-bold">na muita sabedoria há muito enfado; e o que aumenta em conhecimento, aumenta em dor.</strong>
				</p>

				<!-- Author Attribution -->
				<footer
					class="mt-6 md:mt-8"
					in:fade={{ duration: 600, delay: 600 }}
				>
					<cite class="text-muted not-italic">
						<span class="text-sm tracking-widest uppercase md:text-base">— Eclesiastes 1:16-18</span>
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
