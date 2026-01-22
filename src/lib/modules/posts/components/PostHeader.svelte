<script lang="ts">
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import { fade, fly } from "svelte/transition";
	import CloudinaryImage from "$lib/ui/CloudinaryImage.svelte";
	import { getGradientFromSeed } from "$lib/shared/gradients";
	import KindBadge from "$lib/modules/garden/components/KindBadge.svelte";
	import RipenessBadge from "$lib/modules/garden/components/RipenessBadge.svelte";

	interface Props {
		metadata: PostFrontmatter;
	}

	let { metadata }: Props = $props();

	const fallbackGradient = $derived(getGradientFromSeed(metadata.slug));
</script>

<header
	class="relative flex min-h-[50vh] flex-col justify-end overflow-hidden rounded-lg p-8 md:min-h-[55vh] md:p-12"
>
	<!-- Background -->
	<div class="absolute inset-0 z-0">
		{#if metadata.cover?.url}
			<CloudinaryImage
				publicId={metadata.cover.url}
				alt=""
				width={1600}
				height={900}
				priority={true}
				fill={true}
				imgClass="object-center"
			/>
		{:else}
			<div class="h-full w-full" style:background={fallbackGradient}></div>
		{/if}
		<div class="absolute inset-0 bg-linear-to-t from-black/85 via-black/60 to-transparent"></div>
	</div>

	<!-- Content -->
	<div class="relative z-10 flex max-w-6xl flex-col items-start gap-4">
		<!-- Top Meta Row -->
		<div class="flex flex-wrap items-center gap-3 text-sm" in:fade={{ duration: 400, delay: 100 }}>
			{#if metadata.kind}
				<KindBadge kind={metadata.kind} />
			{/if}

			{#if metadata.ripeness}
				<RipenessBadge ripeness={metadata.ripeness} />
			{/if}
		</div>

		<!-- Title -->
		<h1
			class="font-article-title my-2 text-[clamp(2rem,5vw,3.5rem)] leading-[1.15] font-bold tracking-[-0.02em] text-balance text-white"
			in:fly={{ y: 20, duration: 600, delay: 150 }}
		>
			{metadata.title}
		</h1>

		<!-- Subtitle -->
		{#if metadata.subtitle}
			<p
				class="font-article-body my-0 max-w-3xl text-lg leading-relaxed font-normal text-balance text-white/85"
				in:fly={{ y: 15, duration: 500, delay: 250 }}
			>
				{metadata.subtitle}
			</p>
		{/if}
	</div>
</header>
