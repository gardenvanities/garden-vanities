<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/shared/merge-class";

	type Variant =
		| "default"
		| "secondary"
		| "outline"
		| "danger"
		| "warning"
		| "success"
		| "primary"
		| "glass";

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
		"inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-1.5 text-xs font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

	const variants = {
		default: "bg-surface-elevated border-border text-muted",
		secondary: "bg-secondary border-secondary/45 text-secondary-foreground",
		outline: "bg-transparent border-border text-foreground",
		primary: "bg-primary/14 border-primary/35 text-primary",
		danger: "bg-destructive/14 border-destructive/35 text-destructive",
		warning: "bg-warning/14 border-warning/35 text-warning",
		success: "bg-success/14 border-success/35 text-success",

		glass: "bg-surface/82 border-border/70 text-text backdrop-blur-sm"
	};
</script>

<svelte:element this={as} class={cn(baseStyles, variants[variant], className)} {...rest}>
	{@render children()}
</svelte:element>
