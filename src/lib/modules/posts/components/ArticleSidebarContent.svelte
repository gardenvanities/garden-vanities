<script lang="ts">
	import ReadingProgress from "$lib/modules/posts/components/ReadingProgress.svelte";
	import TableOfContents from "$lib/modules/garden/components/TableOfContents.svelte";

	import { fly } from "svelte/transition";
	import type { PostFrontmatter, SerieNavigation } from "$lib/modules/posts/types";

	let { metadata, navigation }: { metadata: PostFrontmatter; navigation?: SerieNavigation } = $props();
</script>

<div class="flex flex-col gap-2">
	<div in:fly|global={{ x: -20, duration: 800, delay: 200 }}>
		<ReadingProgress variant="sidebar" />
	</div>

	<div in:fly|global={{ x: -20, duration: 800, delay: 300 }}>
		<TableOfContents key={metadata.slug} />
	</div>
</div>
