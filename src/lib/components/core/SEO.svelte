<script lang="ts">
	import { page } from "$app/state";
	import { buildCloudinaryUrl } from "$lib/utils/cloudinary";

	const {
		title,
		description = "",
		image = undefined,
		type = "website",
		publishedAt = undefined
	} = $props<{
		title: string;
		description?: string;
		image?: string;
		type?: "website" | "article";
		publishedAt?: string;
	}>();

	const siteName = "Garden of Vanities";
	const baseUrl = "https://gardenofvanities.vercel.app/";

	const fullTitle = $derived(title === siteName ? title : `${title} | ${siteName}`);
	const canonicalUrl = $derived(`${baseUrl}${page.url.pathname}`);
	const ogImage = $derived(
		image ? buildCloudinaryUrl(image, { width: 1200, height: 630 }) : `${baseUrl}/og-default.png`
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:site_name" content={siteName} />

	{#if type === "article" && publishedAt}
		<meta property="article:published_time" content={publishedAt} />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>
