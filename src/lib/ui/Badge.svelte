<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/shared/merge-class";

	type Variant = "default" | "secondary" | "outline" | "danger" | "warning" | "success" | "primary";

	interface Props {
		children: Snippet;
		variant?: Variant;
		class?: string;
		as?: string;

		[key: string]: any;
	}

	let {
		children,
		variant = "default",
		class: className = "",
		as = "div",
		...rest
	}: Props = $props();

	const baseStyles =
		"inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2";

	const variants = {
		default: "border-transparent bg-primary text-primary-contrast shadow hover:bg-primary/80",
		secondary: "border-transparent bg-surface border border-border text-muted hover:text-text",
		outline: "text-text border border-border",
		primary: "border-transparent bg-primary text-primary-contrast shadow hover:bg-primary/80",
		danger: "border-transparent bg-danger text-primary-contrast shadow hover:bg-danger/80",
		warning: "border-transparent bg-warning text-gray-950 shadow hover:bg-warning/80",
		success: "border-transparent bg-success text-primary-contrast shadow hover:bg-success/80"
	};
</script>

<svelte:element this={as} class={cn(baseStyles, variants[variant], className)} {...rest}>
	{@render children()}
</svelte:element>
