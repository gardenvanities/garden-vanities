<script lang="ts">
	import PostAccordion from "$lib/components/garden/PostAccordion.svelte";
	import type { PostFrontmatter } from "$lib/types";

	interface Props {
		data: {
			posts: PostFrontmatter[];
		};
	}

	let { data }: Props = $props();

	let openSlug = $state<string | null>(null);
</script>

<section class="mx-auto max-w-3xl px-4 py-10">
	<header class="mb-8">
		<h1 class="text-2xl font-bold text-gray-100">Artigos</h1>
		<p class="mt-2 text-gray-400">Textos, notas e ideias — cultivados com cuidado 🌱</p>
	</header>

	{#each data.posts as post (post.slug)}
		<PostAccordion
			{post}
			open={openSlug === post.slug}
			ontoggle={() => (openSlug = openSlug === post.slug ? null : post.slug)}
		/>
	{/each}
</section>
