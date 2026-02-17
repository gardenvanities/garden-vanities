<script lang="ts">
	import { ArrowLeft, FolderOpen, Layers } from "@lucide/svelte";
	import { STATUS_LABELS } from "$lib/modules/garden/constants";
	import type { CollectionStatus } from "$lib/modules/posts/collections";
	import type { ImageMetadata } from "$lib/shared/types";
	import CloudinaryImage from "$lib/ui/CloudinaryImage.svelte";
	import Badge from "$lib/ui/Badge.svelte";

	interface Props {
		variant: "series" | "set";
		title: string;
		description?: string;
		cover?: ImageMetadata;
		backHref: string;
		backLabel: string;
		count: number;
		countLabelSingular: string;
		countLabelPlural: string;
		status?: CollectionStatus;
	}

	let {
		variant,
		title,
		description = "",
		cover,
		backHref,
		backLabel,
		count,
		countLabelSingular,
		countLabelPlural,
		status
	}: Props = $props();

	const statusLabel = $derived(status ? STATUS_LABELS[status] || STATUS_LABELS.ongoing : "");
	const countLabel = $derived(count === 1 ? countLabelSingular : countLabelPlural);
	const variantLabel = $derived(variant === "series" ? "Série" : "Set");
	const statusColor = $derived.by(() => {
		if (status === "completed") return "var(--color-success)";
		if (status === "archived") return "var(--color-warning)";
		if (status === "draft") return "var(--color-muted)";
		return "var(--color-primary)";
	});
</script>

<a
	href={backHref}
	class="text-muted bg-surface/50 border-border/30 hover:text-primary hover:bg-primary/8 hover:border-primary/20 mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.05em] uppercase transition-all duration-200"
>
	<ArrowLeft size={14} strokeWidth={2} />
	<span>{backLabel}</span>
</a>

<header class="mb-10 md:mb-12">
	<div class="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-8">
		<div class="flex flex-col items-start gap-4">
			<div class="flex flex-wrap items-center gap-1.5">
				<Badge variant="glass">
					{#if variant === "series"}
						<Layers size={13} />
					{:else}
						<FolderOpen size={13} />
					{/if}
					{variantLabel}
				</Badge>
				{#if status}
					<Badge variant="secondary">
						<span class="inline-block h-1.5 w-1.5 rounded-full" style:background-color={statusColor}></span>
						{statusLabel}
					</Badge>
				{/if}
				<Badge variant="outline">
					<Layers size={13} />
					{count}
					{countLabel}
				</Badge>
			</div>

			<h1 class="font-heading text-text text-[clamp(2.1rem,4.5vw,3.4rem)] leading-[1.08] font-semibold tracking-tight text-balance">
				{title}
			</h1>

			{#if description}
				<p class="text-muted m-0 max-w-[60ch] text-[1.03rem] leading-relaxed text-pretty">
					{description}
				</p>
			{/if}
		</div>

		{#if cover?.url}
			<div class="border-border/60 bg-surface overflow-hidden rounded-lg border">
				<div class="relative aspect-16/10 w-full overflow-hidden">
					<CloudinaryImage
						publicId={cover.url}
						alt={cover.alt || title}
						fill={true}
						width={1200}
						height={750}
						imgClass="transition-transform duration-500 hover:scale-[1.01]"
					/>
					<div class="from-bg/78 absolute inset-0 bg-linear-to-t via-bg/30 to-transparent"></div>
				</div>
			</div>
		{/if}
	</div>
</header>
