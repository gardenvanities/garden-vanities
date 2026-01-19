<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/shared/merge-class";

	type Variant = "default" | "elevated" | "flat";

	interface Props {
		children: Snippet;
		variant?: Variant;
		class?: string;
		href?: string;
		onclick?: (event: MouseEvent) => void;
		as?: string;

		[key: string]: unknown;
	}

	let {
		children,
		variant = "default",
		class: className = "",
		href,
		onclick,
		as = "div",
		...rest
	}: Props = $props();

	const baseStyles = "block rounded-sm transition-all duration-200";

	const variants = {
		default: "bg-surface border border-border shadow-sm hover:border-border-vivid hover:shadow-md",
		elevated: "bg-surface border border-transparent shadow-md hover:shadow-lg",
		flat: "bg-transparent border border-transparent shadow-none"
	};
</script>

{#if href}
	<a {href} class={cn(baseStyles, variants[variant], className)} {onclick} {...rest}>
		{@render children()}
	</a>
{:else}
	<svelte:element
		this={as}
		class={cn(baseStyles, variants[variant], className)}
		role={onclick ? "button" : undefined}
		tabindex={onclick ? 0 : undefined}
		{onclick}
		onkeydown={onclick
			? (e) => e.key === "Enter" && onclick(e as unknown as MouseEvent)
			: undefined}
		{...rest}
	>
		{@render children()}
	</svelte:element>
{/if}
