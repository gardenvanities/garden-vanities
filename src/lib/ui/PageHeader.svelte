<script lang="ts">
	import { fly } from "svelte/transition";

	interface Props {
		title: string;
		description: string;
	}

	let { title, description }: Props = $props();
</script>

<header class="mb-16 flex flex-col items-center text-center md:mb-20">
	<div class="flex flex-col items-center gap-4">
		<h1
			class="font-heading text-text my-0 text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em]"
			in:fly={{ y: 15, duration: 700, delay: 100 }}
		>
			{title}
		</h1>
		<p
			class="text-muted my-0 max-w-[32ch] text-lg font-normal tracking-[0.01em]"
			in:fly={{ y: 10, duration: 600, delay: 250 }}
		>
			{description}
		</p>
	</div>
</header>
