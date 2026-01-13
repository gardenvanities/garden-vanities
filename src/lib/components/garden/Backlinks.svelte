<script lang="ts">
	import type { Backlink, LinkReference } from "$lib/types";
	import KindBadge from "./KindBadge.svelte";
	import { base } from "$app/paths";
	import { Link as LinkIcon, MoveRight, ArrowUpRight, MessageSquareQuote } from "@lucide/svelte";
	import { fly } from "svelte/transition";

	interface Props {
		backlinks?: Backlink[];
		references?: LinkReference[];
	}

	let { backlinks = [], references = [] }: Props = $props();

	// Sort references by title
	const sortedReferences = $derived([...references].sort((a, b) => a.title.localeCompare(b.title)));
</script>

{#if backlinks.length > 0 || references.length > 0}
	<div
		class="mt-20 space-y-16 border-t border-white/5 pt-12"
		in:fly={{ y: 20, duration: 800, delay: 600 }}
	>
		<!-- Incoming Links (Backlinks) -->
		{#if backlinks.length > 0}
			<section>
				<div class="mb-8 flex items-center gap-2">
					<MessageSquareQuote size={18} class="text-brand-primary" />
					<h3 class="text-text-heading m-0 font-serif text-xl font-bold tracking-tight">
						Mencionado em...
					</h3>
				</div>

				<div class="grid grid-cols-1 gap-6">
					{#each backlinks as post (post.slug)}
						<a
							href="{base}/posts/{post.slug}"
							class="group bg-surface-base/50 border-border-default hover:border-brand-primary/30 hover:shadow-brand-primary/5 relative flex flex-col gap-4 rounded-xl border p-5 transition-all duration-300 hover:bg-white/5 hover:shadow-lg"
						>
							<div class="flex items-start justify-between gap-4">
								<div class="space-y-1.5">
									{#if post.kind}
										<KindBadge kind={post.kind} />
									{/if}
									<h4
										class="text-text-heading group-hover:text-brand-primary text-lg font-semibold transition-colors"
									>
										{post.title}
									</h4>
								</div>
								<MoveRight
									size={18}
									class="text-text-muted group-hover:text-brand-primary -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
								/>
							</div>

							<!-- Context Snippet -->
							{#if post.context}
								<div class="relative pl-4">
									<div
										class="bg-brand-primary/30 group-hover:bg-brand-primary/60 absolute top-0 bottom-0 left-0 w-0.5 rounded-full transition-colors"
									></div>
									<p class="text-text-muted text-sm leading-relaxed italic">
										"{post.context}"
									</p>
								</div>
							{:else if post.summary}
								<p class="text-text-muted line-clamp-2 text-sm leading-relaxed">
									{post.summary}
								</p>
							{/if}
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Outgoing Links (References) -->
		{#if sortedReferences.length > 0}
			<section>
				<div class="mb-6 flex items-center gap-2">
					<LinkIcon size={18} class="text-brand-primary" />
					<h3 class="text-text-heading m-0 font-serif text-xl font-bold tracking-tight">
						Referências
					</h3>
				</div>

				<ul class="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
					{#each sortedReferences as ref (ref.slug)}
						<li>
							<a
								href="{base}/posts/{ref.slug}"
								class="text-text-body hover:text-brand-primary group flex items-start gap-2 py-1 transition-colors"
							>
								<ArrowUpRight
									size={14}
									class="mt-1 shrink-0 opacity-30 transition-opacity group-hover:opacity-100"
								/>
								<span
									class="border-b border-transparent leading-snug decoration-1 underline-offset-4 group-hover:border-current"
								>
									{ref.title}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	</div>
{/if}
