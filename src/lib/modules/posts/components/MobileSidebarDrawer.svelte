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
		class="border-t border-border/40 bg-surface/90 fixed inset-x-0 bottom-0 z-50 w-full rounded-t-3xl shadow-2xl backdrop-blur-2xl lg:hidden"
		transition:fly={{ y: 500, duration: 400, opacity: 1 }}
		role="dialog"
		aria-modal="true"
	>
		<!-- Handle Bar -->
		<div class="pointer-events-none absolute left-0 right-0 top-3 flex justify-center">
			<div class="h-1.5 w-12 rounded-full bg-border/60"></div>
		</div>

		<!-- Drawer Header -->
		<div class="flex items-center justify-between px-6 pt-8 pb-4">
			<div>
				<span class="text-xs font-bold tracking-widest text-primary uppercase">Neste Artigo</span>
				<p class="mt-1 line-clamp-1 text-sm font-medium text-muted-foreground">
					{metadata.title}
				</p>
			</div>
			<button
				onclick={close}
				class="text-muted-foreground hover:bg-primary/10 hover:text-primary active:scale-95 flex h-9 w-9 items-center justify-center rounded-full transition-all"
				aria-label="Close sidebar"
			>
				<X size={18} strokeWidth={2.5} />
			</button>
		</div>

		<!-- Drawer Content -->
		<div
			class="scrollbar-thin scrollbar-thumb-border/40 scrollbar-track-transparent max-h-[70vh] overflow-y-auto px-6 pb-12"
		>
			<ArticleSidebarContent {metadata} />
		</div>
	</div>
{/if}
