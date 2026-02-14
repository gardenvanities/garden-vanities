<script lang="ts">
	import type { PostFrontmatter } from "$lib/modules/posts/types";
	import KindBadge from "$lib/modules/garden/components/KindBadge.svelte";
	import RipenessBadge from "$lib/modules/garden/components/RipenessBadge.svelte";
	import { formatShortDate } from "$lib/shared/date";
	import { CalendarDays, Clock } from "@lucide/svelte";
	import { fade } from "svelte/transition";

	interface Props {
		post: PostFrontmatter & { readingTime?: number };
		kindColor?: string;
	}

	let { post, kindColor }: Props = $props();


</script>

<a
	href="/posts/{post.slug}"
	class="group bg-card text-card-foreground hover:shadow-md mb-6 break-inside-avoid block overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:-translate-y-1"
	style:background-color={kindColor ? kindColor + "15" : undefined}
	style:border-color={kindColor ? kindColor + "30" : undefined}
	in:fade={{ duration: 300, delay: 100 }}
>
	<!-- Card Body -->
	<div class="p-5 flex flex-col gap-3">
		<!-- Badges -->
		<div class="flex gap-1.5 justify-end">
			{#if post.kind}
				<KindBadge kind={post.kind} />
			{/if}
			<RipenessBadge ripeness={post.ripeness} />
		</div>

		<h3 class="font-heading text-lg font-bold leading-tight group-hover:text-primary transition-colors">
			{post.title}
		</h3>

		{#if post.summary}
			<p class="text-muted-foreground text-sm line-clamp-4">
				{post.summary}
			</p>
		{/if}
	</div>

	<!-- Card Footer -->
	<div class="border-t bg-muted/20 px-5 py-3 flex items-center justify-between text-xs text-muted-foreground">
		<div class="flex items-center gap-1.5">
			<CalendarDays class="h-3.5 w-3.5" />
			<span>{formatShortDate(post.publishedAt || '')}</span>
		</div>
		{#if post.readingTime}
			<div class="flex items-center gap-1.5">
				<Clock class="h-3.5 w-3.5" />
				<span>{Math.ceil(post.readingTime)} min</span>
			</div>
		{/if}
	</div>
</a>
