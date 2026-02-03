<script lang="ts">
	import { onMount } from "svelte";
	import { SvelteMap } from "svelte/reactivity";

	let tooltipVisible = $state(false);
	let tooltipContent = $state("");
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let footnoteContent = new SvelteMap<string, string>();
	let activeRef: HTMLElement | null = null;
	// Click state management
	// Removed hover timeouts as requested

	onMount(() => {
		const article = document.getElementById("article-content");
		if (!article) {
			console.warn("FootnoteTooltip: Article content not found");
			return;
		}

		console.log("FootnoteTooltip: Initializing...");

		// 1. Parse definitions
		const paragraphs = article.querySelectorAll("p, li, div");
		const definitionsToRemove: Node[] = [];

		paragraphs.forEach((p) => {
			const text = p.textContent?.trim() || "";
			const defMatch = text.match(/^\[\^(\d+)\]:\s+(.*)/);
			if (defMatch) {
				const id = defMatch[1];
				let html = p.innerHTML;
				const prefixRegex = /^\[\^(\d+)\]:\s+/;
				if (prefixRegex.test(text)) {
					html = html.replace(prefixRegex, "");
				}

				footnoteContent.set(id, html);
				definitionsToRemove.push(p);
				console.log(`FootnoteTooltip: Parsed definition for ID ${id}`);
			}
		});

		definitionsToRemove.forEach((el) => {
			(el as HTMLElement).style.display = "none";
		});

		// 2. Parse references
		const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
		const textReplacements: { node: Text; fragment: DocumentFragment }[] = [];

		let node: Node | null;
		while ((node = walker.nextNode())) {
			const textNode = node as Text;
			const text = textNode.textContent || "";
			const parent = textNode.parentElement as HTMLElement;

			if (definitionsToRemove.includes(parent)) continue;
			if (["A", "SCRIPT", "STYLE", "CODE", "PRE"].includes(parent.tagName)) continue;

			// Regex to match (optional text)[^id]
			const refRegex = /(?:\((.*?)\))?\[\^(\d+)\]/g;

			if (refRegex.test(text)) {
				const fragment = document.createDocumentFragment();
				let lastIndex = 0;
				let match;
				refRegex.lastIndex = 0;

				let hasMatch = false;
				while ((match = refRegex.exec(text)) !== null) {
					// match[0] = full match
					// match[1] = optional text inside ()
					// match[2] = id inside [^...]
					const highlightedText = match[1];
					const id = match[2];
					const idx = match.index;
					const len = match[0].length;
					const followChar = text[idx + len];
					if (followChar === ":") continue;

					hasMatch = true;
					const preText = text.slice(lastIndex, idx);
					if (preText) fragment.appendChild(document.createTextNode(preText));

					// Container
					const container = document.createElement("span");
					container.className = "footnote-wrapper";

					// Highlighted text (optional)
					if (highlightedText) {
						const textSpan = document.createElement("span");
						textSpan.textContent = highlightedText;
						textSpan.className = "footnote-highlight";
						textSpan.onclick = (e) => handleClick(e as MouseEvent, id, container); // Cleaner event binding
						container.appendChild(textSpan);
					}

					const sup = document.createElement("sup");
					sup.className = "footnote-ref inline leading-none";

					const a = document.createElement("a");
					a.href = `#fn-${id}`;
					a.className = "footnote-icon-link";
					a.setAttribute("aria-label", "Footnote");
					a.setAttribute("aria-describedby", `tooltip-${id}`);

					a.addEventListener("click", (e) => {
						e.preventDefault();
						handleClick(e, id, a);
					});

					sup.appendChild(a);
					container.appendChild(sup);
					fragment.appendChild(container);

					lastIndex = idx + len;
				}

				if (hasMatch) {
					const remaining = text.slice(lastIndex);
					if (remaining) fragment.appendChild(document.createTextNode(remaining));
					textReplacements.push({ node: textNode, fragment });
				}
			}
		}

		textReplacements.forEach(({ node, fragment }) => {
			node.parentNode?.replaceChild(fragment, node);
		});

		console.log(`FootnoteTooltip: Replaced ${textReplacements.length} text nodes`);

		return () => {
			// Cleanup logic
		};
	});

	function handleClick(e: MouseEvent, id: string, target: HTMLElement) {
		e.stopPropagation(); // Prevent closing immediately due to document click if we add one later

		// If clicking the same one again, toggle off
		if (activeRef === target && tooltipVisible) {
			hideTooltip();
			return;
		}

		const content = footnoteContent.get(id);
		if (!content) return;

		tooltipContent = content;
		activeRef = target;
		updatePosition(target);

		// Wait a tick to ensure position is calculated before showing
		requestAnimationFrame(() => {
			tooltipVisible = true;
		});
	}

	function hideTooltip() {
		tooltipVisible = false;
		activeRef = null;
	}

	function updatePosition(target: HTMLElement) {
		const rect = target.getBoundingClientRect();
		// Center tooltip horizontally relative to the target
		tooltipX = rect.left + window.scrollX + rect.width / 2;
		// Position above the target
		tooltipY = rect.top + window.scrollY - 10;
	}
</script>

{#if tooltipVisible}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="bg-background/60 animate-in fade-in fixed inset-0 z-40 backdrop-blur-[2px] duration-300"
		role="button"
		tabindex="-1"
		aria-label="Close tooltip"
		onclick={hideTooltip}
	></div>

	<div
		class="tooltip-container group text-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 fixed z-50 w-max max-w-[calc(100vw-24px)] -translate-x-1/2 -translate-y-full rounded-xl border border-white/10 bg-neutral-950/95 px-5 py-4 text-sm shadow-2xl ring-1 ring-black/5 backdrop-blur-xl sm:max-w-lg"
		style="left: {tooltipX - window.scrollX}px; top: {tooltipY - window.scrollY}px;"
		role="tooltip"
	>
		<!-- Header/Indicator -->

		<div class="prose prose-sm dark:prose-invert leading-relaxed text-pretty">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html tooltipContent}
		</div>
	</div>
{/if}

<style>
	:global(.prose .footnote-wrapper) {
		display: inline;
		position: relative;
	}

	:global(.prose .footnote-highlight) {
		color: var(--color-primary);
		cursor: pointer;
		transition: all var(--motion-base);
	}

	:global(.prose .footnote-highlight:hover) {
		text-decoration: underline;
		text-decoration-thickness: var(--text-decoration-thickness-thin);
		text-underline-offset: var(--text-underline-offset-normal);
	}

	:global(.prose .footnote-icon-link) {
		color: var(--color-primary);
		text-decoration: none;
		margin-left: var(--space-1);
		display: inline-block;
		cursor: pointer;
		vertical-align: middle; /* Align vertical center with text */
	}

	/* Force reset sup alignment for footnote ref to prevent double lift */
	:global(.prose .footnote-ref) {
		vertical-align: 0.15em;
		top: 0;
		position: relative;
	}

	:global(.prose .footnote-icon-link::after) {
		content: "";
		display: inline-block;
		width: 1em; /* Match standard link icon size */
		height: 1em;
		background-color: currentColor;
		vertical-align: middle;

		/* Lucide Sticky Note Icon */
		-webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z'/%3E%3Cpath d='M15 3v5a2 2 0 0 0 2 2h5'/%3E%3C/svg%3E");
		mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z'/%3E%3Cpath d='M15 3v5a2 2 0 0 0 2 2h5'/%3E%3C/svg%3E");

		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
	}
</style>
