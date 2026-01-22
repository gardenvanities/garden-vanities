<script lang="ts">
	import { page } from "$app/state";
	import { buildCloudinaryUrl } from "$lib/shared/cloudinary";

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
		author = "The Mage King",
		noindex = false
	}: Props = $props();

	const siteName = "Garden of Vanities";
	const baseUrl = "https://gardenofvanities.vercel.app";
	const twitterHandle = "@themageking";

	const fullTitle = $derived(title === siteName ? title : `${title} | ${siteName}`);
	const canonicalUrl = $derived(`${baseUrl}${page.url.pathname}`);

	const ogImage = $derived.by(() => {
		if (image) {
			return buildCloudinaryUrl(image, { width: 1200, height: 630, crop: "fill" });
		}
		
		const params = new URLSearchParams();
		params.set('title', title);
		if (type === 'article') {
			params.set('subtitle', description.slice(0, 100));
			params.set('kind', 'Article');
		} else {
			params.set('subtitle', description.slice(0, 60));
			params.set('kind', 'Garden');
		}
		
		return `${baseUrl}/og?${params.toString()}`;
	});

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

	const jsonLdScript = $derived(
		// eslint-disable-next-line no-useless-escape
		`<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />
	<meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

	<meta name="theme-color" content="#faf8f5" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#0f0d0b" media="(prefers-color-scheme: dark)" />

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

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={twitterHandle} />
	<meta name="twitter:creator" content={twitterHandle} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLdScript}
</svelte:head>
