interface PreviewData {
	title: string;
	excerpt: string;
	publishedAt: string;
	slug: string;
	image?: string;
}

class HoverPreviewStore {
	isOpen = $state(false);
	x = $state(0);
	y = $state(0);
	slug = $state<string | null>(null);
	data = $state<PreviewData | null>(null);
	loading = $state(false);
	error = $state<string | null>(null);

	private cache = new Map<string, PreviewData>();
	private timeout: ReturnType<typeof setTimeout> | null = null;
	private currentRequest: AbortController | null = null;

	open(slug: string, x: number, y: number) {
		// Clear any pending close
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}

		// Don't do anything if already open for this slug
		if (this.isOpen && this.slug === slug) {
			// Update position just in case
			this.x = x;
			this.y = y;
			return;
		}

		this.isOpen = true;
		this.x = x;
		this.y = y;
		this.slug = slug;
		this.loading = true;
		this.error = null;

		if (this.cache.has(slug)) {
			this.data = this.cache.get(slug)!;
			this.loading = false;
		} else {
			this.fetchData(slug);
		}
	}

	close() {
		// Small delay to allow moving mouse to the tooltip itself if needed (though interaction might not be needed)
		// For now, let's just close immediately or with a very small delay
		this.isOpen = false;
		this.slug = null;
	}

	private async fetchData(slug: string) {
		// Abort previous request if any
		if (this.currentRequest) {
			this.currentRequest.abort();
		}

		this.currentRequest = new AbortController();

		try {
			const res = await fetch(`/api/posts/${slug}`, {
				signal: this.currentRequest.signal
			});

			if (!res.ok) throw new Error("Post not found");

			const data = await res.json();

			// Verify if we are still looking at the same slug
			if (this.slug === slug) {
				this.data = data;
				this.loading = false;
				this.cache.set(slug, data);
			}
		} catch (e) {
			if (e instanceof Error && e.name === "AbortError") return;
			console.error("Failed to fetch preview:", e);
			if (this.slug === slug) {
				this.error = "Could not load preview";
				this.loading = false;
			}
		} finally {
			this.currentRequest = null;
		}
	}
}

export const hoverPreview = new HoverPreviewStore();
