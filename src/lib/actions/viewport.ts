export default function viewport(element: HTMLElement) {
	let observer: IntersectionObserver;

	function ensureObserver() {
		if (observer) return;

		observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					element.dispatchEvent(new CustomEvent("enterViewport"));
				} else {
					element.dispatchEvent(new CustomEvent("exitViewport"));
				}
			});
		});

		observer.observe(element);
	}

	ensureObserver();

	return {
		destroy() {
			if (observer) {
				observer.disconnect();
			}
		}
	};
}
