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
	}

	let { key }: Props = $props();

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
</script>

{#if headings.length > 0}
	<nav class="hidden lg:sticky lg:top-24 lg:block lg:h-fit lg:w-64" aria-label="Sumário">
		<h4
			class="text-text-heading mb-4 font-serif text-sm font-bold tracking-widest uppercase italic"
		>
			Sumário
		</h4>
		<ul class="space-y-3 border-l border-white/5 py-1">
			{#each headings as { id, text, level }, i (id)}
				<li
					class={level === 3 ? "ml-4" : ""}
					in:fly={{ x: 10, duration: 600, delay: 400 + i * 50 }}
				>
					<a
						href="#{id}"
						class="block text-sm transition-all duration-300 {activeId === id
							? 'text-brand-primary font-medium'
							: 'text-text-muted hover:text-text-body'}"
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

<style>
	/* Esconder se houver poucos itens */
	nav:empty {
		display: none;
	}
</style>
