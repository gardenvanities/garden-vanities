<script lang="ts">
	import { cn } from "$lib/shared/merge-class";
	import {
		PanelRightClose,
		PanelRightOpen,
		X,
		List,
	} from "@lucide/svelte";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { ui } from "$lib/stores/ui.svelte";
	import TableOfContents from "$lib/modules/garden/components/TableOfContents.svelte";
	import ReadingProgress from "./ReadingProgress.svelte";
	import type { PostFrontmatter } from "$lib/modules/posts/types";

	interface Props {
		metadata: PostFrontmatter;
	}

	let { metadata }: Props = $props();

	let isExpanded = $derived(ui.articleSidebarExpanded);
	let isMobileOpen = $derived(ui.articleSidebarMobileOpen);

	onMount(() => {
		const listener = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isMobileOpen) {
				ui.closeArticleSidebarMobile();
			}
		};
		window.addEventListener("keydown", listener);
		return () => window.removeEventListener("keydown", listener);
	});
</script>

<button
	type="button"
	class="fixed top-4 right-4 z-40 flex items-center justify-center w-10 h-10 rounded-md border border-border bg-(--material-thick) backdrop-blur-lg text-text cursor-pointer transition-all duration-fast shadow-md active:scale-[0.92] lg:hidden"
	onclick={() => ui.openArticleSidebarMobile()}
	aria-label="Abrir menu do artigo"
>
	<List size={20} strokeWidth={2} />
</button>

{#if isMobileOpen}
	<button
		type="button"
		class="fixed inset-0 z-41 bg-black/50 backdrop-blur-sm border-none cursor-default lg:hidden"
		onclick={() => ui.closeArticleSidebarMobile()}
		aria-label="Fechar menu"
		transition:fade={{ duration: 200 }}
	></button>
{/if}

<aside
	class={cn(
		"fixed top-0 right-0 bottom-0 z-42 flex flex-col bg-surface border-l border-border transition-[width,transform] duration-base ease-(--motion-ease-out-quint)",
		"max-lg:w-[280px] max-lg:translate-x-full max-lg:border-l max-lg:border-border",
		isMobileOpen && "max-lg:translate-x-0",
		isExpanded ? "lg:w-[260px]" : "lg:w-12"
	)}
	aria-label="Navegação do artigo"
>
	<div class="flex items-center p-4 min-h-14 gap-2">
		<button
			type="button"
			class="hidden lg:flex items-center justify-center w-8 h-8 rounded-sm border-none bg-transparent text-muted cursor-pointer shrink-0 transition-all duration-fast hover:text-text hover:bg-surface-hover active:scale-90"
			onclick={() => ui.toggleArticleSidebar()}
			aria-label={isExpanded ? "Colapsar menu" : "Expandir menu"}
		>
			{#if isExpanded}
				<PanelRightClose size={18} strokeWidth={2} />
			{:else}
				<PanelRightOpen size={18} strokeWidth={2} />
			{/if}
		</button>
		
		{#if isExpanded}
			<span class="text-xs font-bold uppercase tracking-widest text-muted whitespace-nowrap overflow-hidden">Neste Artigo</span>
		{/if}

		<button
			type="button"
			class="flex lg:hidden items-center justify-center w-8 h-8 rounded-sm border-none bg-transparent text-muted cursor-pointer shrink-0 transition-all duration-fast hover:text-text hover:bg-surface-hover active:scale-90 ml-auto"
			onclick={() => ui.closeArticleSidebarMobile()}
			aria-label="Fechar menu"
		>
			<X size={18} strokeWidth={2} />
		</button>
	</div>

	<div class="flex-1 overflow-y-auto overflow-x-hidden px-3 scrollbar-none" data-lenis-prevent>
		{#if isExpanded || isMobileOpen}
			<div>
				<TableOfContents key={metadata.slug} title="" />
			</div>
		{/if}
	</div>

	{#if isExpanded || isMobileOpen}
		<div class="mt-auto">
			<ReadingProgress />
		</div>
	{/if}
</aside>
