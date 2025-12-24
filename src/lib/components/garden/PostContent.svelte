<!-- src/lib/components/posts/PostContent.svelte -->
<script lang="ts">
	export let content: string;
</script>

<div class="post-content prose prose-neutral dark:prose-invert max-w-none">
	{@html content}
</div>

<style>
	.post-content :global(h2) {
		@apply mt-10 mb-4 scroll-mt-20 text-2xl font-semibold;
	}

	.post-content :global(h3) {
		@apply mt-8 mb-3 scroll-mt-20 text-xl font-semibold;
	}

	.post-content :global(h4) {
		@apply mt-6 mb-2 scroll-mt-20 text-lg font-medium;
	}

	.post-content :global(p) {
		@apply mb-4 leading-relaxed;
	}

	.post-content :global(a) {
		@apply text-primary hover:text-primary/80 underline underline-offset-2 transition-colors;
	}

	.post-content :global(ul),
	.post-content :global(ol) {
		@apply mb-4 pl-6;
	}

	.post-content :global(ul) {
		@apply list-disc;
	}

	.post-content :global(ol) {
		@apply list-decimal;
	}

	.post-content :global(li) {
		@apply mb-2;
	}

	.post-content :global(blockquote) {
		@apply border-primary/30 text-muted-foreground my-6 border-l-4 pl-4 italic;
	}

	.post-content :global(code:not(pre code)) {
		@apply bg-muted rounded px-1.5 py-0.5 font-mono text-sm;
	}

	.post-content :global(pre) {
		@apply bg-muted my-6 overflow-x-auto rounded-lg p-4;
	}

	.post-content :global(pre code) {
		@apply bg-transparent p-0 text-sm;
	}

	.post-content :global(img) {
		@apply mx-auto my-6 rounded-lg;
	}

	.post-content :global(figure) {
		@apply my-8;
	}

	.post-content :global(figcaption) {
		@apply text-muted-foreground mt-2 text-center text-sm;
	}

	.post-content :global(hr) {
		@apply border-muted my-10;
	}

	.post-content :global(table) {
		@apply my-6 w-full text-sm;
	}

	.post-content :global(th) {
		@apply bg-muted/50 border-b p-2 text-left font-semibold;
	}

	.post-content :global(td) {
		@apply border-b p-2;
	}

	.post-content :global(.heading-anchor) {
		@apply text-muted-foreground ml-2 no-underline opacity-0;
	}

	.post-content :global(h2:hover .heading-anchor),
	.post-content :global(h3:hover .heading-anchor),
	.post-content :global(h4:hover .heading-anchor) {
		@apply opacity-100;
	}
</style>
