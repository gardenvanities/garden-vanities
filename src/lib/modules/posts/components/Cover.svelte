<script lang="ts">
	import CloudinaryImage from "$lib/ui/CloudinaryImage.svelte";

	interface Props {
		publicId: string;
		alt: string;
		caption?: string;
		width?: number;
		aspectRatio?: string;
		priority?: boolean;
	}

	let {
		publicId,
		alt,
		caption = undefined,
		width = 1200,
		aspectRatio = "1.91/1",
		priority = false
	}: Props = $props();
</script>

<CloudinaryImage
	{publicId}
	{alt}
	{caption}
	{width}
	{aspectRatio}
	{priority}
	class="cloudinary-image"
	imgClass="rounded-md"
/>
