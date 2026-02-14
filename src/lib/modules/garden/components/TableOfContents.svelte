<script lang="ts">
	import { fly } from "svelte/transition";
	import { tick } from "svelte";

	import { ui } from "$lib/stores/ui.svelte";
	import { scrollState } from "$lib/stores/scroll.svelte";

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
	let isInteracting = false;

	
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
		void key; 

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

			let timeout: ReturnType<typeof setTimeout>;

			observer = new IntersectionObserver(
				(entries) => {
					
					if (timeout || isInteracting) return;

					timeout = setTimeout(() => {
						if (isInteracting) return;
						entries.forEach((entry) => {
							if (entry.isIntersecting) {
								activeId = entry.target.id;
							}
						});
						timeout = undefined!;
					}, 100);
				},
				{ rootMargin: "-100px 0% -70% 0%" }
			);

			document
				.querySelectorAll(".prose h2, .prose h3, .prose h4")
				.forEach((el) => observer.observe(el));
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

			
			if (window.innerWidth < 1024) {
				ui.closeSidebar();
			}

			if (scrollState.instance) {
				scrollState.instance.scrollTo(element, { offset: -100, lock: true, duration: 0.6 });
			} else {
				window.scrollTo({ top: y, behavior: "smooth" });
			}

			activeId = id;
		}
	}
</script>

{#snippet tree(nodes: HeadingNode[])}
	<ul class="m-0 list-none pl-3">
		{#each nodes as node (node.id)}
			{@const isActive = activeId === node.id}
			<li class="m-0 p-0">
				
				<a
					href="#{node.id}"
					class="mb-2 block touch-manipulation text-sm leading-tight transition-colors duration-200 {isActive
						? 'text-primary font-medium'
						: 'text-muted sm:hover:text-white'}"
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
	<nav
		class="block h-fit w-full lg:sticky lg:top-0"
		aria-label={title}
		onmouseenter={() => (isInteracting = true)}
		onmouseleave={() => (isInteracting = false)}
		ontouchstart={() => (isInteracting = true)}
		ontouchend={() => setTimeout(() => (isInteracting = false), 1000)}
	>
		<h4 class="text-muted mb-5 text-xs font-bold tracking-widest uppercase">
			{title}
		</h4>

		<ul class="m-0 ml-0 list-none pl-0">
			{#each headings as node, i (node.id)}
				{@const isActive = activeId === node.id}
				<li class="m-0 p-0" in:fly={{ x: 10, duration: 400, delay: 200 + i * 30 }}>
					<a
						href="#{node.id}"
						class="mb-2 block touch-manipulation text-sm leading-tight font-medium transition-colors duration-200 {isActive
							? 'text-primary'
							: 'text-muted sm:hover:text-white'}"
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
