<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/shared/merge-class";

	interface Props {
		children: Snippet;
		class?: string;
		size?: "sm" | "md" | "lg" | "xl" | "full";
		as?: string;

		[key: string]: unknown;
	}

	let { children, class: className = "", size = "lg", as = "div", ...rest }: Props = $props();

	const sizes = {
		sm: "max-w-2xl",
		md: "max-w-4xl",
		lg: "max-w-6xl",
		xl: "max-w-7xl",
		full: "max-w-full"
	};
</script>

<svelte:element
	this={as}
	class={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)}
	{...rest}
>
	{@render children()}
</svelte:element>
