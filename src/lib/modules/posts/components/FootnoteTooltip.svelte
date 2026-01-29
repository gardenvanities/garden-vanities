<script lang="ts">
	import { onMount } from "svelte";
	import { SvelteMap } from "svelte/reactivity";

	let tooltipVisible = $state(false);
	let tooltipContent = $state("");
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let footnoteContent = new SvelteMap<string, string>();
	let activeRef: HTMLElement | null = null;
	let tooltipEl = $state<HTMLElement>();

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

			const refRegex = /\[\^(\d+)\]/g;
			if (refRegex.test(text)) {
				const fragment = document.createDocumentFragment();
				let lastIndex = 0;
				let match;
				refRegex.lastIndex = 0;

				let hasMatch = false;
				while ((match = refRegex.exec(text)) !== null) {
					const id = match[1];
					const idx = match.index;
					const len = match[0].length;
					const followChar = text[idx + len];
					if (followChar === ":") continue;

					hasMatch = true;
					const preText = text.slice(lastIndex, idx);
					if (preText) fragment.appendChild(document.createTextNode(preText));

					const sup = document.createElement("sup");
					sup.className = "footnote-ref";

					const a = document.createElement("a");
					a.href = `#fn-${id}`;
					a.textContent = id;
					a.className =
						"text-primary hover:text-primary/80 ml-0.5 cursor-pointer font-medium no-underline transition-colors bookmark-link";

					a.setAttribute("aria-describedby", `tooltip-${id}`);
					// Events are handled by global delegation

					sup.appendChild(a);
					fragment.appendChild(sup);

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

		// Add global listeners
		document.body.addEventListener("click", handleClick);

		return () => {
			document.body.removeEventListener("click", handleClick);
		};
	});

	function handleClick(e: Event) {
		const target = e.target as HTMLElement;
		const link = target.closest('a[href^="#fn-"]');

		if (link) {
			e.preventDefault();
			e.stopPropagation();

			const id = link.getAttribute("href")?.replace("#fn-", "");

			if (activeRef === link && tooltipVisible) {
				hideTooltip();
			} else {
				if (id) showTooltip(e, id, link as HTMLElement);
			}
		} else {
			// Close if clicking outside
			if (tooltipVisible && !target.closest(".tooltip-container")) {
				hideTooltip();
			}
		}
	}

	function showTooltip(e: Event, contentId: string, target: HTMLElement) {
		const content = footnoteContent.get(contentId);

		if (!content) {
			console.warn(`FootnoteTooltip: Content not found for ${contentId}`);
			return;
		}

		tooltipContent = content;
		tooltipVisible = true;
		activeRef = target;

		updatePosition(target);
	}

	function hideTooltip() {
		tooltipVisible = false;
		activeRef = null;
	}

	function updatePosition(target: HTMLElement) {
		const rect = target.getBoundingClientRect();
		tooltipX = rect.left + window.scrollX + rect.width / 2;
		tooltipY = rect.top + window.scrollY - 8;
	}
</script>

{#if tooltipVisible}
	<div
		bind:this={tooltipEl}
		class="tooltip-container text-popover-foreground border-border bg-popover animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 fixed z-50 max-w-xs -translate-x-1/2 -translate-y-full rounded-md border px-3 py-2 text-sm shadow-md"
		style="left: {tooltipX - window.scrollX}px; top: {tooltipY - window.scrollY}px;"
		role="tooltip"
	>
		<div class="prose prose-sm dark:prose-invert leading-snug">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html tooltipContent}
		</div>
		<div
			class="bg-popover border-border absolute -bottom-1.5 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b"
		></div>
	</div>
{/if}
