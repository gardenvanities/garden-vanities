let articleContentElement = $state<HTMLElement | null>(null);
let articleHeaderElement = $state<HTMLElement | null>(null);

export const articleDom = {
	get contentElement() {
		return articleContentElement;
	},
	get headerElement() {
		return articleHeaderElement;
	},
	setContentElement(element: HTMLElement | null) {
		articleContentElement = element;
	},
	setHeaderElement(element: HTMLElement | null) {
		articleHeaderElement = element;
	},
	reset() {
		articleContentElement = null;
		articleHeaderElement = null;
	}
};
