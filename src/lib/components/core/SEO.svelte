<script lang="ts">
	import { page } from "$app/state";
	import { buildCloudinaryUrl } from "$lib/utils/cloudinary";

	interface Props {
		title: string;
		description?: string;
		image?: string;
		type?: "website" | "article";
		publishedAt?: string;
		updatedAt?: string;
		author?: string;
		noindex?: boolean;
	}

	const {
		title,
		description = "Explorações sobre design, código e botânica no jardim digital de Vanities.",
		image = undefined,
		type = "website",
		publishedAt = undefined,
		updatedAt = undefined,
		author = "@themageking",
		noindex = false
	}: Props = $props();

	const siteName = "Garden of Vanities";
	const baseUrl = "https://gardenofvanities.vercel.app"; // Removido trailing slash para consistência
	const twitterHandle = "@themageking";

	const fullTitle = $derived(title === siteName ? title : `${title} | ${siteName}`);
	const canonicalUrl = $derived(`${baseUrl}${page.url.pathname}`);

	// Imagem OG com fallback inteligente
	const ogImage = $derived(
		image
			? buildCloudinaryUrl(image, { width: 1200, height: 630, crop: "fill" })
			: `${baseUrl}/og-default.png`
	);

	// Dados Estruturados (JSON-LD)
	const jsonLd = $derived({
		"@context": "https://schema.org",
		"@type": type === "article" ? "BlogPosting" : "WebSite",
		name: fullTitle,
		description: description,
		url: canonicalUrl,
		image: ogImage,
		...(type === "article"
			? {
					headline: title,
					datePublished: publishedAt,
					dateModified: updatedAt || publishedAt,
					author: {
						"@type": "Person",
						name: "The Mage King",
						url: baseUrl
					}
				}
			: {})
	});
	// Structured Data Script
	const jsonLdScript = $derived(
		// eslint-disable-next-line no-useless-escape
		`<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`
	);
</script>

<svelte:head>
	<!-- Básico -->
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />
	<meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
	<!-- Theme color: light/dark based on user preference -->
	<meta name="theme-color" content="#faf8f5" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#0f0d0b" media="(prefers-color-scheme: dark)" />
	<!-- Fallback for browsers that don't support media in theme-color -->

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content="pt_BR" />

	{#if type === "article"}
		{#if publishedAt}<meta property="article:published_time" content={publishedAt} />{/if}
		{#if updatedAt}<meta property="article:modified_time" content={updatedAt} />{/if}
		<meta property="article:author" content={author} />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={twitterHandle} />
	<meta name="twitter:creator" content={twitterHandle} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

	<!-- Structured Data -->
	<!-- eslint-disable svelte/no-at-html-tags -->
	{@html jsonLdScript}
</svelte:head>
