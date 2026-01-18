<script lang="ts">
	import { ui } from "$lib/stores/ui.svelte";
	import { fly, fade } from "svelte/transition";
	import { X } from "@lucide/svelte";
	import ArticleSidebarContent from "./ArticleSidebarContent.svelte";
	import type { PostFrontmatter } from "$lib/modules/posts/types";

	let { metadata }: { metadata: PostFrontmatter } = $props();

	function close() {
		ui.closeSidebar();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			close();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if ui.sidebarVisible}
	<!-- Backdrop -->
	<button
		type="button"
		class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
		transition:fade={{ duration: 200 }}
		onclick={close}
		aria-label="Close sidebar"
	></button>

	<!-- Drawer -->
	<!-- eslint-disable-next-line svelte/no-unused-svelte-ignore -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="border-border bg-bg/95 fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] border-r p-6 shadow-2xl backdrop-blur-xl lg:hidden"
		transition:fly={{ x: -280, duration: 300, opacity: 1 }}
		role="dialog"
		aria-modal="true"
	>
		<div class="mb-6 flex items-center justify-between">
			<span class="text-muted text-sm font-bold tracking-widest uppercase">Navegação</span>
			<button
				onclick={close}
				class="text-muted hover:bg-surface hover:text-text rounded-md p-2 transition-colors"
				aria-label="Close sidebar"
			>
				<X size={20} />
			</button>
		</div>

		<div
			class="scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent h-[calc(100vh-5rem)] overflow-y-auto pr-2"
		>
			<ArticleSidebarContent {metadata} />
		</div>
	</div>
{/if}
