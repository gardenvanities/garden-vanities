<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/shared/merge-class";

	type Variant = "default" | "secondary" | "outline" | "danger" | "warning" | "success" | "primary";

	interface Props {
		children: Snippet;
		variant?: Variant;
		class?: string;
		as?: string;

		[key: string]: unknown;
	}

	let {
		children,
		variant = "default",
		class: className = "",
		as = "div",
		...rest
	}: Props = $props();

	const baseStyles =
		"inline-flex items-center justify-center rounded-sm bg-surface-elevated/50 px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2";

	const variants = {
		default: "border border-border text-muted hover:border-primary/50 hover:text-primary hover:bg-surface-elevated",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		outline: "text-foreground border border-border bg-transparent",
		primary: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/90",
		danger: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/90",
		warning: "border-transparent bg-warning text-warning-foreground shadow hover:bg-warning/90",
		success: "border-transparent bg-success text-success-foreground shadow hover:bg-success/90"
	};
</script>

<svelte:element this={as} class={cn(baseStyles, variants[variant], className)} {...rest}>
	{@render children()}
</svelte:element>
