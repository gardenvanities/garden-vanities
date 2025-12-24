<!-- src/lib/components/common/CloudinaryImage.svelte -->
<script lang="ts">
	import { buildCloudinaryUrl, buildSrcSet } from '$lib/utils/cloudinary';

	export let publicId: string;
	export let alt: string;
	export let caption: string | undefined = undefined;
	export let width: number = 1200;
	export let aspectRatio: string = '16/9';
	export let priority: boolean = false;
</script>

<figure class="clounary-image">
	<img
		src={buildCloudinaryUrl(publicId, { width })}
		srcset={buildSrcSet(publicId)}
		sizes="(max-width 768) 100vw, (max-width: 1200px) 80vw, 1200px"
		{alt}
		loading={priority ? 'eager' : 'lazy'}
		decoding={priority ? 'sync' : 'async'}
		style:aspect-ratio={aspectRatio}
		class="h-auto w-full rounded-lg object-cover"
	/>
	{#if caption}
		<figcaption class="text-muted-foreground mt-2 text-center text-sm">
			{caption}
		</figcaption>
	{/if}
</figure>
