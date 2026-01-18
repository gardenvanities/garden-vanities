<script lang="ts">
	import type { PostFrontmatter } from "$lib/modules/posts/types";

	interface Props {
		metadata: PostFrontmatter;
	}

	let { metadata }: Props = $props();
</script>

<header class="mb-12">
	<div>
		<h1 class="article-title text-balance">
			{metadata.title}
		</h1>

		{#if metadata.subtitle}
			<p class="text-text/80 font-article-body mt-4 text-xl leading-relaxed text-balance">
				{metadata.subtitle}
			</p>
		{/if}
	</div>
</header>
