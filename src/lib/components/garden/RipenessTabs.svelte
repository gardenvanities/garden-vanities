<script lang="ts">
	import type { Ripeness, PostFrontmatter } from "$lib/types";
	import RipenessBadge from "./RipenessBadge.svelte";
	import Card from "$lib/components/ui/Card.svelte";
	import { formatRelativeDate } from "$lib/utils/date";
	import { fly } from "svelte/transition";
	import type { Component } from "svelte";

	import { Sprout, Leaf, Apple } from "@lucide/svelte";

	interface Props {
		posts: {
			seed: PostFrontmatter[];
			root: PostFrontmatter[];
			fruit: PostFrontmatter[];
		};
	}

	let { posts }: Props = $props();

	let activeTab = $state<Ripeness>("fruit");

	const tabs: Array<{ value: Ripeness; label: string; icon: Component }> = [
		{ value: "seed", label: "Sementes", icon: Sprout },
		{ value: "root", label: "Raízes", icon: Leaf },
		{ value: "fruit", label: "Frutos", icon: Apple }
	];

	const activePosts = $derived(posts[activeTab]);
</script>

<div class="flex flex-col gap-6">
	<!-- Tab Buttons -->
	<div class="border-border scrollbar-thin flex gap-2 overflow-x-auto border-b" role="tablist">
		{#each tabs as tab (tab.value)}
			{@const isActive = activeTab === tab.value}
			<button
				type="button"
				role="tab"
				aria-selected={isActive}
				class="font-heading -mb-[2px] flex cursor-pointer items-center gap-2 border-b-2 bg-transparent px-5 py-3 font-semibold whitespace-nowrap transition-all duration-200 {isActive
					? 'border-primary text-text'
					: 'text-muted hover:text-text hover:bg-action-hover border-transparent'}"
				onclick={() => (activeTab = tab.value)}
			>
				<div class="flex items-center justify-center">
					<tab.icon size={18} strokeWidth={2} />
				</div>
				<span class="font-heading">{tab.label}</span>
			</button>
		{/each}
	</div>

	<!-- Tab Content -->
	<div class="min-h-[400px]" role="tabpanel">
		{#if activePosts.length === 0}
			<div
				class="text-muted flex items-center justify-center p-10 italic"
				in:fly={{ y: 20, duration: 400 }}
			>
				<p>Nenhuma nota neste estágio ainda.</p>
			</div>
		{:else}
			<div class="flex flex-col gap-4">
				{#each activePosts as post, i (post.slug)}
					<div in:fly={{ y: 20, duration: 400, delay: i * 50 }}>
						<Card
							href="/posts/{post.slug}"
							class="flex flex-col gap-2 p-4 hover:translate-x-1 sm:px-5"
							variant="default"
						>
							<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start sm:gap-4">
								<h3 class="text-text m-0 flex-1 text-lg leading-tight font-semibold">
									{post.title}
								</h3>
								<div class="flex shrink-0 items-center gap-2 self-start sm:self-auto">
									<RipenessBadge ripeness={post.ripeness} showLabel={false} />
									{#if post.updatedAt}
										<span
											class="text-muted text-xs font-semibold tracking-wider whitespace-nowrap uppercase"
											>{formatRelativeDate(post.updatedAt)}</span
										>
									{/if}
								</div>
							</div>
							{#if post.summary}
								<p class="text-muted m-0 text-sm leading-normal">{post.summary}</p>
							{/if}
						</Card>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
