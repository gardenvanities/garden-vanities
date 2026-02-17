<script lang="ts">
	import { SvelteMap } from "svelte/reactivity";
	import { sanitizeHtml } from "$lib/shared/sanitize-html";

	interface Props {
		contentElement?: HTMLElement | null;
	}

	let { contentElement = null }: Props = $props();

	let tooltipVisible = $state(false);
	let tooltipContent = $state("");
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let footnoteContent = new SvelteMap<string, string>();
	let activeRef: HTMLElement | null = null;
	
	

	$effect(() => {
		const article = contentElement;
		if (!article) return;


		
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

				footnoteContent.set(id, sanitizeHtml(html));
				definitionsToRemove.push(p);
			}
		});

		definitionsToRemove.forEach((el) => {
			(el as HTMLElement).style.display = "none";
		});

		
		const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
		const textReplacements: { node: Text; fragment: DocumentFragment }[] = [];

		let node: Node | null;
		while ((node = walker.nextNode())) {
			const textNode = node as Text;
			const text = textNode.textContent || "";
			const parent = textNode.parentElement as HTMLElement;

			if (definitionsToRemove.includes(parent)) continue;
			if (["A", "SCRIPT", "STYLE", "CODE", "PRE"].includes(parent.tagName)) continue;

			
			const refRegex = /(?:\((.*?)\))?\[\^(\d+)\]/g;

			if (refRegex.test(text)) {
				const fragment = document.createDocumentFragment();
				let lastIndex = 0;
				let match;
				refRegex.lastIndex = 0;

				let hasMatch = false;
				while ((match = refRegex.exec(text)) !== null) {
					
					
					
					const highlightedText = match[1];
					const id = match[2];
					const idx = match.index;
					const len = match[0].length;
					const followChar = text[idx + len];
					if (followChar === ":") continue;

					hasMatch = true;
					const preText = text.slice(lastIndex, idx);
					if (preText) fragment.appendChild(document.createTextNode(preText));

					
					const container = document.createElement("span");
					container.className = "footnote-wrapper";

					
					if (highlightedText) {
						const textSpan = document.createElement("span");
						textSpan.textContent = highlightedText;
						textSpan.className = "footnote-highlight";
						textSpan.onclick = (e) => handleClick(e as MouseEvent, id, container); 
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


	});

	function handleClick(e: MouseEvent, id: string, target: HTMLElement) {
		e.stopPropagation(); 

		
		if (activeRef === target && tooltipVisible) {
			hideTooltip();
			return;
		}

		const content = footnoteContent.get(id);
		if (!content) return;

		tooltipContent = sanitizeHtml(content);
		activeRef = target;
		updatePosition(target);

		
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
		
		tooltipX = rect.left + window.scrollX + rect.width / 2;
		
		tooltipY = rect.top + window.scrollY - 10;
	}
</script>

{#if tooltipVisible}
	
	<button
		class="bg-background/60 animate-in fade-in fixed inset-0 z-40 backdrop-blur-[2px] duration-300 w-full h-full border-none cursor-default"
		type="button"
		aria-label="Close tooltip"
		onclick={hideTooltip}
	></button>

	<div
		class="tooltip-container group text-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 fixed z-50 w-max max-w-[calc(100vw-24px)] -translate-x-1/2 -translate-y-full rounded-xl border border-border bg-surface-elevated/95 px-5 py-4 text-sm shadow-2xl ring-1 ring-border/20 backdrop-blur-xl sm:max-w-lg"
		style="left: {tooltipX - window.scrollX}px; top: {tooltipY - window.scrollY}px;"
		role="tooltip"
	>
		

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
		vertical-align: middle;  
	}

	 
	:global(.prose .footnote-ref) {
		vertical-align: 0.15em;
		top: 0;
		position: relative;
	}

	:global(.prose .footnote-icon-link::after) {
		content: "";
		display: inline-block;
		width: 1em;  
		height: 1em;
		background-color: currentColor;
		vertical-align: middle;

		 
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
