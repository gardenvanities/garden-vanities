<script lang="ts">
	import { buildCloudinaryUrl, buildLQIP, buildSrcSet } from "$lib/shared/cloudinary";
	import { getGradientFromSeed } from "$lib/shared/gradients";

	interface Props {
		publicId: string;
		alt: string;
		caption?: string;
		width?: number;
		height?: number;
		aspectRatio?: string;
		priority?: boolean;
		class?: string;
		imgClass?: string;
		fill?: boolean; 
	}

	let {
		publicId,
		alt,
		caption = undefined,
		width = 1200,
		height = undefined,
		aspectRatio = "1.91/1",
		priority = false,
		class: className = "",
		imgClass = "",
		fill = false,
		onError
	}: Props & { onError?: () => void } = $props();

	let loaded = $state(false);
	let error = $state(false);

	const src = $derived(buildCloudinaryUrl(publicId, { width, height }));
	const srcset = $derived(buildSrcSet(publicId));
	const lqip = $derived(buildLQIP(publicId));
	const gradientBg = $derived(getGradientFromSeed(publicId));

	function handleLoad() {
		loaded = true;
	}

	function handleError() {
		error = true;
		if (onError) onError();
		console.warn(`Cloudinary image failed to load: ${publicId}`);
	}
</script>

<figure class="overflow-hidden {fill ? 'absolute inset-0 h-full w-full' : 'relative'} {className}">
	
	{#if !priority && lqip && !loaded && !error}
		<img
			src={lqip}
			alt=""
			aria-hidden="true"
			class="absolute inset-0 h-full w-full object-cover blur-sm"
			style:aspect-ratio={fill ? undefined : aspectRatio}
		/>
	{/if}

	
	{#if !error}
		<img
			{src}
			{srcset}
			sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
			{alt}
			loading={priority ? "eager" : "lazy"}
			decoding={priority ? "sync" : "async"}
			onload={handleLoad}
			onerror={handleError}
			style:aspect-ratio={fill ? undefined : aspectRatio}
			class="object-cover transition-opacity duration-300 {fill
				? 'h-full w-full'
				: 'relative h-auto w-full'} {loaded ? 'opacity-100' : 'opacity-0'} {imgClass}"
		/>
	{/if}

	{#if error}
		<div
			class="absolute inset-0 h-full w-full"
			style:background={gradientBg}
			style:aspect-ratio={fill ? undefined : aspectRatio}
			aria-label="Image failed to load"
		></div>
	{/if}

	{#if caption}
		<figcaption class="text-muted mt-2 text-center text-sm">
			{caption}
		</figcaption>
	{/if}
</figure>
