<script lang="ts" module>
	function number(n: number | string): number {
		return typeof n === "string" ? parseInt(n) : n;
	}
</script>

<script lang="ts">
	import { ArrowLeft, ArrowRight } from "@lucide/svelte";

	interface Props {
		currentPage: number;
		totalPages: number;
		pageSize?: number;
		baseUrl?: string;
		pageSizeOptions?: number[];
	}

	let {
		currentPage,
		totalPages,
		pageSize = 10,
		baseUrl = "/posts",
		pageSizeOptions = [5, 10, 20, 50]
	}: Props = $props();

	function getPageUrl(page: number) {
		return `${baseUrl}?page=${page}&limit=${pageSize}`;
	}

	function getLimitUrl(limit: number) {
		// Reset to page 1 when changing limit
		return `${baseUrl}?page=1&limit=${limit}`;
	}

	function generatePages(current: number, total: number) {
		const pages: (number | string)[] = [];

		if (total <= 7) {
			for (let i = 1; i <= total; i++) {
				pages.push(i);
			}
			return pages;
		}

		pages.push(1);
		if (current > 4) pages.push("...");

		let start = Math.max(2, current - 2);
		let end = Math.min(total - 1, current + 2);

		if (current <= 4) {
			end = 5;
			start = 2; // already handled
		}

		if (current >= total - 3) {
			start = total - 4;
		}

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		if (current < total - 3) pages.push("...");
		pages.push(total);

		return pages;
	}

	const pages = $derived(generatePages(currentPage, totalPages));
</script>

{#if totalPages > 1 || pageSizeOptions.length > 0}
	<div class="mt-16 flex flex-col items-center gap-4">
		<!-- Pagination Controls -->
		{#if totalPages > 1}
			<nav aria-label="Pagination">
				<div class="bg-border/50 inline-flex items-center gap-1.5 rounded-xl p-1.5">
					<!-- Previous Button -->
					<a
						href={currentPage > 1 ? getPageUrl(currentPage - 1) : undefined}
						class="bg-surface text-text hover:bg-surface/80 flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm transition-all disabled:opacity-50 {currentPage <=
						1
							? 'pointer-events-none opacity-50'
							: ''}"
						data-sveltekit-noscroll
						aria-disabled={currentPage <= 1}
					>
						<ArrowLeft size={14} class="opacity-60" />
						<span>Prev</span>
					</a>

					<!-- Page Numbers -->
					<div class="mx-2 flex items-center gap-1">
						{#each pages as page (page)}
							{#if page === "..."}
								<span
									class="text-muted flex h-8 w-8 items-center justify-center text-sm tracking-widest"
								>
									...
								</span>
							{:else}
								<a
									href={getPageUrl(number(page))}
									class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors {currentPage ===
									page
										? 'bg-primary text-primary-contrast shadow-sm'
										: 'text-muted hover:text-text hover:bg-black/5 dark:hover:bg-white/10'}"
									data-sveltekit-noscroll
									aria-current={currentPage === page ? "page" : undefined}
								>
									{page}
								</a>
							{/if}
						{/each}
					</div>

					<!-- Next Button -->
					<a
						href={currentPage < totalPages ? getPageUrl(currentPage + 1) : undefined}
						class="bg-surface text-text hover:bg-surface/80 flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm transition-all disabled:opacity-50 {currentPage >=
						totalPages
							? 'pointer-events-none opacity-50'
							: ''}"
						data-sveltekit-noscroll
						aria-disabled={currentPage >= totalPages}
					>
						<span>Next</span>
						<ArrowRight size={14} class="opacity-60" />
					</a>
				</div>
			</nav>
		{/if}

		<!-- Rows Per Page Selector -->
		<div class="bg-border/50 inline-flex items-center gap-1 rounded-xl p-1.5">
			{#each pageSizeOptions as option (option)}
				<a
					href={getLimitUrl(option)}
					class="flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-all {pageSize ===
					option
						? 'bg-surface text-text shadow-sm'
						: 'text-muted hover:text-text'}"
					data-sveltekit-noscroll
				>
					{option}
					{pageSize === option ? "rows" : ""}
				</a>
			{/each}
		</div>
	</div>
{/if}
