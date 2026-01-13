<script lang="ts">
	import { Folder } from "@lucide/svelte";
	import { cn } from "$lib/utils/merge-class";

	interface Props {
		name: string;
		count: number;
		href: string;
		class?: string;
	}

	let { name, count, href, class: className = "" }: Props = $props();
</script>

<a
	{href}
	class={cn(
		"border-border bg-surface text-decoration-none hover:border-border-vivid flex items-center gap-4 rounded-md border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
		className
	)}
>
	<div
		class="bg-primary text-primary-contrast flex h-12 w-12 shrink-0 items-center justify-center rounded-md"
	>
		<Folder size={24} strokeWidth={1.5} />
	</div>
	<div class="min-w-0 flex-1">
		<h3 class="font-heading text-text m-0 text-lg leading-tight font-semibold">{name}</h3>
		<p class="text-muted mt-1 text-xs font-semibold tracking-wider uppercase">
			{count}
			{count === 1 ? "nota" : "notas"}
		</p>
	</div>
</a>
