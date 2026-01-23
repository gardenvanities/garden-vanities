<script lang="ts">
	import { fly } from "svelte/transition";
	import { tick } from "svelte";

	interface HeadingNode {
		id: string;
		text: string;
		level: number;
		children: HeadingNode[];
	}

	interface Props {
		key?: string;
		title?: string;
	}

	let { key, title = "Índice" }: Props = $props();

	let headings = $state<HeadingNode[]>([]);
	let activeId = $state("");

	// Recursive helper to build the tree
	function buildTree(elements: { id: string; text: string; level: number }[]): HeadingNode[] {
		const root: HeadingNode[] = [];
		const stack: HeadingNode[] = [];

		elements.forEach((el) => {
			const node: HeadingNode = { ...el, children: [] };

			while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
				stack.pop();
			}

			if (stack.length > 0) {
				stack[stack.length - 1].children.push(node);
			} else {
				root.push(node);
			}

			stack.push(node);
		});

		return root;
	}

	$effect(() => {
		void key; // React to key changes if needed

		let observer: IntersectionObserver;

		const init = async () => {
			await tick();

			const elements = Array.from(document.querySelectorAll(".prose h2, .prose h3, .prose h4")).map(
				(el) => ({
					id: el.id,
					text: (el as HTMLElement).innerText,
					level: parseInt(el.tagName[1])
				})
			);

			headings = buildTree(elements);

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

			document.querySelectorAll(".prose h2, .prose h3, .prose h4").forEach((el) => observer.observe(el));
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

{#snippet tree(nodes: HeadingNode[])}
	<ul class="pl-2 space-y-0">
		{#each nodes as node (node.id)}
			{@const isActive = activeId === node.id}
			<li class="relative pl-6">
				<!-- Content -->
				<a
					href="#{node.id}"
					class="block text-sm py-1 transition-all duration-300 {isActive
						? 'text-primary font-medium'
						: 'text-muted hover:text-text'}"
					onclick={(e) => handleAnchorClick(e, node.id)}
				>
					{node.text}
				</a>

				{#if node.children.length > 0}
					{@render tree(node.children)}
				{/if}
			</li>
		{/each}
	</ul>
{/snippet}

{#if headings.length > 0}
	<nav class="block h-fit w-full lg:sticky lg:top-24" aria-label={title}>
		<h4 class="text-muted font-body mb-4 text-xs font-bold tracking-widest uppercase">
			{title}
		</h4>

		<ul class="space-y-4">
			{#each headings as node, i (node.id)}
				{@const isActive = activeId === node.id}
				<li class="relative" in:fly={{ x: 10, duration: 600, delay: 400 + i * 50 }}>
					<a
						href="#{node.id}"
						class="block text-sm font-semibold mb-2 transition-all duration-300 {isActive
							? 'text-primary'
							: 'text-text hover:text-primary'}"
						onclick={(e) => handleAnchorClick(e, node.id)}
					>
						{node.text}
					</a>

					{#if node.children.length > 0}
						{@render tree(node.children)}
					{/if}
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<style>
	/* Tree View Lines */
	ul ul li::before {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 1px;
		background-color: rgba(255, 255, 255, 0.1);
	}

	ul ul li::after {
		content: "";
		position: absolute;
		top: 0.9em; /* Vertically align with text center */
		left: 0;
		width: 1rem; /* Width of the connector L */
		height: 1px;
		background-color: rgba(255, 255, 255, 0.1);
	}

	/* Fix for last child: vertical line should stop at the horizontal connector */
	ul ul li:last-child::before {
		height: 0.9em; /* Stop exactly where the horizontal line is */
	}
</style>
