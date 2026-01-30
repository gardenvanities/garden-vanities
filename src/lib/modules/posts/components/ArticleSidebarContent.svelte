<script lang="ts">
	import TableOfContents from "$lib/modules/garden/components/TableOfContents.svelte";

	import type { PostFrontmatter } from "$lib/modules/posts/types";

	let { metadata }: { metadata: PostFrontmatter } = $props();
</script>

<div class="flex flex-col gap-2">
	<div>
		<TableOfContents key={metadata.slug} />
	</div>
</div>
