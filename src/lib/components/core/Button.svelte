<script lang="ts">
	import type { Snippet } from "svelte";

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
		onclick?: (event: MouseEvent) => void;
	}

	let {
		children,
		variant = "primary",
		size = "md",
		class: className = "",
		href,
		type = "button",
		disabled = false,
		onclick
	}: Props = $props();

	const baseStyles =
		"inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none";

	const variants = {
		primary: "bg-primary text-primary-contrast hover:bg-primary/90 shadow-sm",
		secondary: "bg-surface text-text hover:bg-surface/80 border border-white/5",
		outline:
			"border border-border text-text hover:border-primary/50 hover:text-primary bg-transparent",
		ghost: "text-muted hover:text-text hover:bg-white/5"
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
		class="{baseStyles} {variants[variant]} {sizes[size]} {className}"
		role="button"
		onclick={onclick as ((event: MouseEvent) => void) | undefined}
	>
		{@render children()}
	</a>
{:else}
	<button
		{type}
		{disabled}
		class="{baseStyles} {variants[variant]} {sizes[size]} {className}"
		{onclick}
	>
		{@render children()}
	</button>
{/if}
