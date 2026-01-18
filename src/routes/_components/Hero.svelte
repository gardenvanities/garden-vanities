<script lang="ts">
	import { Leaf, Sparkles, Star, Flower2, Route, Eye } from "@lucide/svelte";
	import Container from "$lib/layout/Container.svelte";
	import { fly } from "svelte/transition";
</script>

<section
	class="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden py-16 md:py-24"
>
	<Container size="xl">
		<div class="w-full">
			<!-- Main Typographic Statement - Full Width -->
			<div class="space-y-3 md:space-y-5 lg:space-y-6">
				<!-- Line 1 -->
				<p
					class="font-heading flex flex-wrap items-center justify-start gap-x-3 gap-y-2 text-2xl leading-[1.1] font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
					in:fly={{ y: 40, duration: 700, delay: 0 }}
				>
					<span class="text-text">Alguns</span>
					<span
						class="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-600 md:px-4 md:py-1.5 md:text-xl dark:text-green-400"
					>
						<Leaf size={16} class="md:h-5 md:w-5" />
						<span>jardins</span>
					</span>
					<span class="text-text">você</span>
					<span class="text-muted font-serif italic">apenas</span>
					<span class="text-text">visita</span>
					<span class="text-primary">—</span>
					<span class="text-muted font-normal">passeia entre as flores,</span>
					<span
						class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 text-pink-500 md:h-10 md:w-10"
					>
						<Flower2 size={18} />
					</span>
					<span class="text-muted font-normal">tira fotos</span>
					<span class="text-muted font-serif italic">e vai embora.</span>
				</p>

				<!-- Line 2 -->
				<p
					class="font-heading flex flex-wrap items-center justify-start gap-x-3 gap-y-2 text-2xl leading-[1.1] font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
					in:fly={{ y: 40, duration: 700, delay: 150 }}
				>
					<span class="text-text">Outros</span>
					<span
						class="bg-primary text-primary-contrast inline-flex h-9 w-9 items-center justify-center rounded-xl shadow-lg md:h-12 md:w-12"
					>
						<Sparkles size={20} strokeWidth={2.5} />
					</span>
					<span class="text-text">você</span>
					<span class="text-primary font-sans font-black tracking-wider">cultiva</span>
					<span class="text-primary">—</span>
					<span class="text-muted font-normal">planta sementes,</span>
					<span class="text-muted font-normal">rega</span>
					<span class="text-text font-serif italic">com paciência,</span>
					<span class="text-muted font-normal">e espera</span>
					<span
						class="border-border bg-surface-elevated text-muted inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold md:px-4 md:py-1.5 md:text-xl"
					>
						<span>florescer</span>
					</span>
				</p>

				<!-- Line 3 -->
				<p
					class="font-heading flex flex-wrap items-center justify-start gap-x-3 gap-y-2 text-2xl leading-[1.1] font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
					in:fly={{ y: 40, duration: 700, delay: 300 }}
				>
					<span class="text-text">Este aqui</span>
					<span
						class="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-600 md:px-4 md:py-1.5 md:text-xl dark:text-amber-400"
					>
						<Star size={14} class="fill-current md:h-4 md:w-4" />
						<span>você explora</span>
					</span>
					<span class="text-primary">—</span>
					<span class="text-muted font-normal">sem mapa,</span>
					<span
						class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 md:h-10 md:w-10"
					>
						<Route size={18} />
					</span>
					<span class="text-muted font-normal">sem pressa,</span>
					<span class="text-text font-serif italic">seguindo sua</span>
					<span class="text-primary font-sans font-black tracking-wider">intuição</span>
					<span
						class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 md:h-10 md:w-10"
					>
						<Eye size={18} />
					</span>
				</p>
			</div>
		</div>
	</Container>
</section>
