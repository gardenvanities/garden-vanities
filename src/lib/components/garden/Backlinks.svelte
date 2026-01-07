<script lang="ts">
	import type { PostFrontmatter } from "$lib/types";
	import KindBadge from "./KindBadge.svelte";
	import { base } from "$app/paths";
	import { Link as LinkIcon, MoveRight } from "lucide-svelte";
	import { fly } from "svelte/transition";

	interface Props {
		backlinks: PostFrontmatter[];
	}

	let { backlinks }: Props = $props();
</script>

{#if backlinks.length > 0}
	<section
		class="mt-20 border-t border-white/5 pt-12"
		in:fly={{ y: 20, duration: 800, delay: 600 }}
	>
		<div class="mb-8 flex items-center gap-2">
			<LinkIcon size={18} class="text-brand-primary" />
			<h3 class="text-text-heading m-0 font-serif text-xl font-bold tracking-tight">
				Mencionado em...
			</h3>
		</div>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each backlinks as post (post.slug)}
				<a
					href="{base}/posts/{post.slug}"
					class="group bg-surface-base/50 border-border-default hover:border-brand-primary/30 flex flex-col gap-3 rounded-xl border p-5 transition-all duration-300 hover:bg-white/5"
				>
					<div class="flex items-start justify-between gap-4">
						<div class="space-y-2">
							{#if post.kind}
								<KindBadge kind={post.kind} />
							{/if}
							<h4
								class="text-text-heading group-hover:text-brand-primary text-base font-semibold transition-colors"
							>
								{post.title}
							</h4>
						</div>
						<MoveRight
							size={18}
							class="text-text-muted group-hover:text-brand-primary -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
						/>
					</div>

					{#if post.excerpt}
						<p class="text-text-muted line-clamp-2 text-sm leading-relaxed">
							{post.excerpt}
						</p>
					{/if}
				</a>
			{/each}
		</div>
	</section>
{/if}
