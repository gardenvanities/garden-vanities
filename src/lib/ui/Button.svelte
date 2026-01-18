<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/shared/merge-class";

	type Variant = "primary" | "secondary" | "outline" | "ghost";
	type Size = "sm" | "md" | "lg";

	interface Props {
		children: Snippet;
		variant?: Variant;
		size?: Size;
		class?: string;
		href?: string;
		type?: "button" | "submit" | "reset";
		disabled?: boolean;

		[key: string]: unknown;
	}

	let {
		children,
		variant = "primary",
		size = "md",
		class: className = "",
		href,
		type = "button",
		disabled = false,
		...rest
	}: Props = $props();

	const baseStyles =
		"inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

	const variants = {
		primary: "bg-primary text-primary-contrast hover:bg-accent shadow-sm border border-transparent",
		secondary: "bg-surface text-text hover:bg-action-hover border border-border-vivid",
		outline:
			"border border-border text-text hover:border-primary/50 hover:text-primary bg-transparent",
		ghost: "text-muted hover:text-text hover:bg-action-hover"
	};

	const sizes = {
		sm: "h-8 px-3 text-xs gap-1.5",
		md: "h-10 px-4 text-sm gap-2",
		lg: "h-12 px-6 text-base gap-2.5"
	};
</script>

{#if href}
	<a
		{href}
		class={cn(baseStyles, variants[variant], sizes[size], className)}
		role="button"
		{...rest}
	>
		{@render children()}
	</a>
{:else}
	<button
		{type}
		{disabled}
		class={cn(baseStyles, variants[variant], sizes[size], className)}
		{...rest}
	>
		{@render children()}
	</button>
{/if}
