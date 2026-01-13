<script lang="ts">
	import { onMount } from "svelte";
	import { hoverPreview } from "$lib/stores/hover-preview.svelte";

	// Only active on desktop usually, but we can verify screen size if needed.

	function getSlugFromUrl(url: string): string | null {
		try {
			// Handle relative URLs or full URLs
			const urlObj = new URL(url, window.location.origin);
			if (urlObj.origin !== window.location.origin) return null;

			// Check for /posts/slug pattern
			const match = urlObj.pathname.match(/\/posts\/([^/]+)$/);
			return match ? match[1] : null;
		} catch {
			return null;
		}
	}

	onMount(() => {
		const handleMouseOver = (e: MouseEvent) => {
			const target = (e.target as HTMLElement).closest("a");
			if (!target) return;

			const href = target.getAttribute("href");
			if (!href) return;

			const slug = getSlugFromUrl(href);
			if (slug) {
				const rect = target.getBoundingClientRect();
				// Center horizontally on the link, position below
				hoverPreview.open(slug, rect.left + rect.width / 2, rect.bottom);
			}
		};

		const handleMouseOut = (e: MouseEvent) => {
			// If moving to the tooltip, we might want to keep it open?
			// For simplicity V1, close on mouse out of link.
			const target = (e.target as HTMLElement).closest("a");
			if (target) {
				hoverPreview.close();
			}
		};

		document.addEventListener("mouseover", handleMouseOver);
		document.addEventListener("mouseout", handleMouseOut);

		return () => {
			document.removeEventListener("mouseover", handleMouseOver);
			document.removeEventListener("mouseout", handleMouseOut);
		};
	});
</script>

<slot />
