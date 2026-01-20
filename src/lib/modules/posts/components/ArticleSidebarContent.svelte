<script lang="ts">
	import ReadingProgress from "$lib/modules/posts/components/ReadingProgress.svelte";
	import TableOfContents from "$lib/modules/garden/components/TableOfContents.svelte";
	import PostMetaSidebar from "$lib/modules/posts/components/PostMetaSidebar.svelte";
	import { fly } from "svelte/transition";
	import type { PostFrontmatter } from "$lib/modules/posts/types";

	let { metadata }: { metadata: PostFrontmatter } = $props();
</script>

<div class="flex flex-col gap-6">
	<div in:fly|global={{ x: -20, duration: 800, delay: 200 }}>
		<ReadingProgress variant="sidebar" />
	</div>

	<div in:fly|global={{ x: -20, duration: 800, delay: 300 }}>
		<TableOfContents key={metadata.slug} title={metadata.title} />
	</div>

	<div in:fly|global={{ x: -20, duration: 800, delay: 400 }}>
		<PostMetaSidebar {metadata} />
	</div>
</div>
