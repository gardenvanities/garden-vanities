<script lang="ts">
	import type { Ripeness, PostFrontmatter } from "$lib/types";
	import RipenessBadge from "./RipenessBadge.svelte";
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

<div class="ripeness-tabs">
	<!-- Tab Buttons -->
	<div class="tabs-header" role="tablist">
		{#each tabs as tab (tab.value)}
			<button
				type="button"
				role="tab"
				aria-selected={activeTab === tab.value}
				class="tab-button"
				class:active={activeTab === tab.value}
				onclick={() => (activeTab = tab.value)}
			>
				<div class="tab-icon">
					<tab.icon size={18} strokeWidth={2} />
				</div>
				<span class="tab-label">{tab.label}</span>
			</button>
		{/each}
	</div>

	<!-- Tab Content -->
	<div class="tabs-content" role="tabpanel">
		{#if activePosts.length === 0}
			<div class="empty-state" in:fly={{ y: 20, duration: 400 }}>
				<p>Nenhuma nota neste estágio ainda.</p>
			</div>
		{:else}
			<div class="posts-list">
				{#each activePosts as post, i (post.slug)}
					<a
						href="/posts/{post.slug}"
						class="post-item"
						in:fly={{ y: 20, duration: 400, delay: i * 50 }}
					>
						<div class="post-header">
							<h3 class="post-title">{post.title}</h3>
							<div class="post-badges">
								<RipenessBadge ripeness={post.ripeness} showLabel={false} />
								{#if post.updatedAt}
									<span class="post-date">{formatRelativeDate(post.updatedAt)}</span>
								{/if}
							</div>
						</div>
						{#if post.summary}
							<p class="post-summary">{post.summary}</p>
						{/if}
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.ripeness-tabs {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	/* Tab Header */
	.tabs-header {
		display: flex;
		gap: var(--space-2);
		border-bottom: 2px solid var(--color-border);
		overflow-x: auto;
		scrollbar-width: thin;
	}

	.tab-button {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-5);
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		color: var(--color-muted);
		font-size: var(--type-1);
		font-weight: 600;
		cursor: pointer;
		transition: all var(--motion-base) var(--motion-ease);
		white-space: nowrap;
	}

	.tab-button:hover {
		color: var(--color-text);
		background: var(--color-action-hover);
	}

	.tab-button.active {
		color: var(--color-text);
		border-bottom-color: var(--color-primary);
	}

	.tab-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: currentColor;
	}

	.tab-label {
		font-family: var(--font-heading);
	}

	/* Tab Content */
	.tabs-content {
		min-height: 400px;
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-10);
		color: var(--color-muted);
		font-size: var(--type-1);
		font-style: italic;
	}

	.posts-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.post-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-4) var(--space-5);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-2);
		text-decoration: none;
		transition: all var(--motion-base) var(--motion-ease);
	}

	.post-item:hover {
		border-color: var(--color-border-vivid);
		box-shadow: var(--shadow-2);
		transform: translateX(4px);
	}

	.post-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--space-4);
	}

	.post-title {
		font-size: var(--type-2);
		font-weight: 600;
		color: var(--color-text);
		margin: 0;
		line-height: var(--line-height-heading);
		flex: 1;
	}

	.post-badges {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-shrink: 0;
	}

	.post-date {
		font-size: var(--type-0);
		color: var(--color-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 600;
		white-space: nowrap;
	}

	.post-summary {
		font-size: var(--type-1);
		color: var(--color-muted);
		line-height: var(--line-height-body);
		margin: 0;
	}

	@media (max-width: 640px) {
		.post-header {
			flex-direction: column;
			gap: var(--space-2);
		}

		.post-badges {
			align-self: flex-start;
		}
	}
</style>
