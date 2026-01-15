<script lang="ts">
	import { fly } from "svelte/transition";
	import { tick } from "svelte";

	interface Heading {
		id: string;
		text: string;
		level: number;
	}

	interface Props {
		key?: string;
		title?: string;
	}

	let { key, title = "Índice" }: Props = $props();

	let headings = $state<Heading[]>([]);
	let activeId = $state("");

	// Re-scan headings whenever 'key' (the slug) changes
	$effect(() => {
		// Reactive dependency on key
		void key;

		let observer: IntersectionObserver;

		const init = async () => {
			// Wait for the DOM to update with the new post content
			await tick();

			const elements = Array.from(document.querySelectorAll(".prose h2, .prose h3"));

			headings = elements.map((el) => ({
				id: el.id,
				text: (el as HTMLElement).innerText,
				level: parseInt(el.tagName[1])
			}));

			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							activeId = entry.target.id;
						}
					});
				},
				{ rootMargin: "-100px 0% -70% 0%" }
			);

			elements.forEach((el) => observer.observe(el));
		};

		init();

		return () => {
			if (observer) observer.disconnect();
		};
	});

	function handleAnchorClick(e: MouseEvent, id: string) {
		e.preventDefault();
		const element = document.getElementById(id);
		if (element) {
			// Center the element or stick to top with offset
			const y = element.getBoundingClientRect().top + window.scrollY - 100; // 100px offset for header
			window.scrollTo({ top: y, behavior: "smooth" });
			activeId = id;
		}
	}
</script>

{#if headings.length > 0}
	<nav class="hidden h-fit w-64 lg:sticky lg:top-24 lg:block" aria-label={title}>
		<h4 class="text-muted font-body mb-4 text-xs font-bold tracking-widest uppercase">
			{title}
		</h4>

		<ul class="border-border space-y-3 border-l py-1">
			{#each headings as { id, text, level }, i (id)}
				<li
					class={level === 3 ? "ml-4" : ""}
					in:fly={{ x: 10, duration: 600, delay: 400 + i * 50 }}
				>
					<a
						href="#{id}"
						class="block text-sm transition-all duration-300 {activeId === id
							? 'text-primary font-medium'
							: 'text-muted hover:text-text'}"
						onclick={(e) => handleAnchorClick(e, id)}
					>
						<span
							class="mr-2 inline-block h-px w-3 bg-current opacity-20 transition-all {activeId ===
							id
								? 'w-6 opacity-100'
								: ''}"
						></span>
						{text}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
