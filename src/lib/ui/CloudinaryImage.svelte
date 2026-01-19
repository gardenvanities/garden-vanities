<script lang="ts">
	import { buildCloudinaryUrl, buildLQIP, buildSrcSet } from "$lib/shared/cloudinary";
	import { onMount } from "svelte";

	interface Props {
		publicId: string;
		alt: string;
		caption?: string;
		width?: number;
		height?: number;
		aspectRatio?: string;
		priority?: boolean;
		class?: string;
	}

	let {
		publicId,
		alt,
		caption = undefined,
		width = 1200,
		height = undefined,
		aspectRatio = "1.91/1",
		priority = false,
		class: className = ""
	}: Props = $props();

	let loaded = $state(false);
	let error = $state(false);

	const src = $derived(buildCloudinaryUrl(publicId, { width, height }));
	const srcset = $derived(buildSrcSet(publicId));
	const lqip = $derived(buildLQIP(publicId));

	function handleLoad() {
		loaded = true;
	}

	function handleError() {
		error = true;
		console.warn(`Cloudinary image failed to load: ${publicId}`);
	}
</script>

<figure class="cloudinary-image {className}">
	<!-- LQIP Background -->
	{#if !priority && lqip && !loaded}
		<img
			src={lqip}
			alt=""
			aria-hidden="true"
			class="absolute inset-0 h-full w-full object-cover blur-sm"
			style:aspect-ratio={aspectRatio}
		/>
	{/if}

	<!-- Main Image -->
	<img
		{src}
		{srcset}
		sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
		{alt}
		loading={priority ? "eager" : "lazy"}
		decoding={priority ? "sync" : "async"}
		onload={handleLoad}
		onerror={handleError}
		style:aspect-ratio={aspectRatio}
		class="relative h-auto w-full rounded-md object-cover transition-opacity duration-300 {loaded
			? 'opacity-100'
			: 'opacity-0'}"
	/>

	{#if error}
		<div
			class="flex items-center justify-center rounded-md bg-surface-200 text-muted"
			style:aspect-ratio={aspectRatio}
		>
			<span class="text-sm">Image failed to load</span>
		</div>
	{/if}

	{#if caption}
		<figcaption class="text-muted mt-2 text-center text-sm">
			{caption}
		</figcaption>
	{/if}
</figure>

<style>
	.cloudinary-image {
		position: relative;
		overflow: hidden;
	}
</style>
