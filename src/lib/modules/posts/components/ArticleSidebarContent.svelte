<script lang="ts">
	import TableOfContents from "$lib/modules/garden/components/TableOfContents.svelte";

	import { fly } from "svelte/transition";
	import type { PostFrontmatter } from "$lib/modules/posts/types";

	let { metadata }: { metadata: PostFrontmatter } = $props();
</script>

<div class="flex flex-col gap-2">
	<div in:fly|global={{ x: -20, duration: 400, delay: 100 }}>
		<TableOfContents key={metadata.slug} />
	</div>
</div>
