<script lang="ts">
	import { FolderOpen, Layers3 } from "@lucide/svelte";
	import CloudinaryImage from "$lib/ui/CloudinaryImage.svelte";
	import { cn } from "$lib/shared/merge-class";

	interface Props {
		set: {
			slug: string;
			title: string;
			description?: string;
			count: number;
			href: string;
			cover?: { url: string; alt?: string };
		};
		class?: string;
	}

	let { set, class: className = "" }: Props = $props();
</script>

<a
	href={set.href}
	class={cn(
		"group border-border bg-surface hover:border-border-vivid mb-6 block w-full break-inside-avoid overflow-hidden rounded-xl border transition-all duration-200 hover:-translate-y-px hover:shadow-md",
		className
	)}
>
	<div class="relative aspect-4/3 overflow-hidden">
		{#if set.cover?.url}
			<CloudinaryImage
				publicId={set.cover.url}
				alt={set.cover.alt || set.title}
				fill={true}
				imgClass="transition-transform duration-500 group-hover:scale-[1.025]"
				width={1200}
				height={900}
			/>
		{:else}
			<div class="bg-surface-elevated absolute inset-0">
				<div
					class="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,var(--color-text)_1px,transparent_0)] bg-size-[18px_18px] opacity-6"
				></div>
				<div class="from-accent/35 absolute inset-0 bg-linear-to-br via-transparent to-primary/15"></div>
			</div>
		{/if}

		<div class="absolute inset-0 bg-linear-to-t from-transparent via-transparent to-bg/10"></div>

		<div class="absolute top-3 right-3 z-10">
			<div class="bg-surface/75 border-border/70 text-text inline-flex items-center gap-1.5 rounded-xs border px-2 py-1 text-[11px] font-medium tracking-[0.06em] uppercase backdrop-blur-md">
				<FolderOpen size={14} />
				<span>Set</span>
			</div>
		</div>
	</div>

	<div class="relative px-3 pb-3">
		<div class="bg-surface-elevated/96 border-border/80 -mt-5 rounded-lg border px-4 pt-4 pb-3 shadow-sm backdrop-blur-md">
			<div class="absolute top-0 left-4 h-3.5 w-24 -translate-y-full rounded-t-md border border-b-0 border-border/80 bg-surface-elevated/96"></div>

			<h3 class="font-heading text-text mb-2 text-xl leading-snug font-semibold tracking-tight">
				{set.title}
			</h3>

			{#if set.description}
				<p class="text-muted mb-4 text-sm leading-relaxed text-pretty">
					{set.description}
				</p>
			{/if}

			<div class="text-muted flex items-center text-[12px] font-medium">
				<span class="inline-flex items-center gap-1.5">
					<Layers3 size={14} />
					{set.count}
					{set.count === 1 ? "item" : "itens"}
				</span>
			</div>
		</div>
	</div>
</a>
