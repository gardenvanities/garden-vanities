import { spring } from "svelte/motion";
import { articleDom } from "$lib/stores/article-dom.svelte";

function createReadingProgress() {
	let readingTimeMinutes = $state(1);
	let rawProgress = $state(0);

	
	const progress = spring(0, {
		stiffness: 0.1,
		damping: 0.4
	});

	function calculateReadingTime() {
		const article = articleDom.contentElement;
		if (article) {
			const text = article.innerText;
			const wpm = 200;
			const words = text.trim().split(/\s+/).length;
			readingTimeMinutes = Math.max(1, Math.ceil(words / wpm));
		} else {
			readingTimeMinutes = 1;
		}
	}

	function handleScroll() {
		const articleEl = articleDom.contentElement;

		if (!articleEl) {
			rawProgress = 0;
			progress.set(0);
			return;
		}

		const headerEl = articleDom.headerElement;
		const currentScrollTop = window.scrollY;
		const rect = articleEl.getBoundingClientRect();
		const winHeight = window.innerHeight;

		
		const startEl = headerEl || articleEl;
		const startRect = startEl.getBoundingClientRect();
		const startTop = startRect.top + currentScrollTop;

		
		const endBottom = rect.bottom + currentScrollTop;

		const startOffset = startTop;
		
		const endOffset = endBottom - winHeight * 0.8;

		let percent = 0;
		if (currentScrollTop <= startOffset) {
			percent = 0;
		} else if (currentScrollTop >= endOffset) {
			percent = 100;
		} else {
			percent = ((currentScrollTop - startOffset) / (endOffset - startOffset)) * 100;
		}

		rawProgress = Math.min(100, Math.max(0, percent));
		progress.set(rawProgress);
	}

	return {
		get percent() {
			return rawProgress;
		},
		get spring() {
			return progress;
		},
		get readingTime() {
			return readingTimeMinutes;
		},
		get minutesLeft() {
			return Math.max(1, Math.ceil(readingTimeMinutes * (1 - rawProgress / 100)));
		},
		setElements(elements: { content: HTMLElement | null; header: HTMLElement | null }) {
			articleDom.setContentElement(elements.content);
			articleDom.setHeaderElement(elements.header);
			calculateReadingTime();
			handleScroll();
		},
		init() {
			calculateReadingTime();
			handleScroll();
			window.addEventListener("scroll", handleScroll, { passive: true });
			window.addEventListener("resize", handleScroll, { passive: true });

			return () => {
				window.removeEventListener("scroll", handleScroll);
				window.removeEventListener("resize", handleScroll);
			};
		},
		reset() {
			rawProgress = 0;
			progress.set(0, { hard: true });
			calculateReadingTime();
		}
	};
}

export const readingProgress = createReadingProgress();
