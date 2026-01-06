<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/core/Header.svelte";
	import Footer from "$lib/components/core/Footer.svelte";

	const { children } = $props();
</script>

<div
	class="text-text-body bg-surface-base selection:bg-brand-primary/20 selection:text-brand-primary flex min-h-screen flex-col font-sans antialiased"
>
	<Header />

	<main class="grow">
		{@render children?.()}
	</main>

	<Footer />
</div>
