<!-- src/lib/components/common/SEO.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { buildCloudinaryUrl } from '$lib/utils/cloudinary';

	export let title: string;
	export let description: string = '';
	export let image: string | undefined = undefined;
	export let type: 'website' | 'article' = 'website';
	export let publishedAt: string | undefined = undefined;

	const siteName = 'Garden of Vanities';
	const baseUrl = 'https://gardenofvanities.com';

	$: fullTitle = title === siteName ? title : `${title} | ${siteName}`;
	$: canonicalUrl = `${baseUrl}${$page.url.pathname}`;
	$: ogImage = image
		? buildCloudinaryUrl(image, { width: 1200, height: 630 })
		: `${baseUrl}/og-default.png`;
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

	{#if type === 'article' && publishedAt}
		<meta property="article:published_time" content={publishedAt} />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>
