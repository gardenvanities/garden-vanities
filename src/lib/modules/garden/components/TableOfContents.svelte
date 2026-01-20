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

	$effect(() => {
		void key;

		let observer: IntersectionObserver;

		const init = async () => {
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
			const y = element.getBoundingClientRect().top + window.scrollY - 100;
			window.scrollTo({ top: y, behavior: "smooth" });
			activeId = id;
		}
	}
</script>

{#if headings.length > 0}
	<nav class="block h-fit w-full lg:sticky lg:top-24" aria-label={title}>
		<h4 class="text-muted font-body mb-4 text-xs font-bold tracking-widest uppercase">
			{title}
		</h4>

		<ul class="space-y-2">
			{#each headings as { id, text, level }, i (id)}
				{@const isActive = activeId === id}
				{@const indent = level === 2 ? "pl-0" : level === 3 ? "pl-4" : "pl-8"}
				<li
					class={indent}
					in:fly={{ x: 10, duration: 600, delay: 400 + i * 50 }}
				>
					<a
						href="#{id}"
						class="group flex items-center gap-2 py-1 text-sm transition-all duration-300 {isActive
							? 'text-primary font-medium'
							: 'text-muted hover:text-text'}"
						onclick={(e) => handleAnchorClick(e, id)}
					>
						<!-- Dot Indicator -->
						<span
							class="h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300 {isActive
								? 'bg-primary scale-100 opacity-100'
								: 'bg-muted scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-50'}"
						></span>
						<span class="leading-snug">{text}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
