<script lang="ts">
	import { cn } from "$lib/shared/merge-class";

	import { FolderOpen } from "@lucide/svelte";
	import CloudinaryImage from "$lib/ui/CloudinaryImage.svelte";

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
		"group relative block h-72 w-full overflow-hidden rounded-sm transition-all duration-500 select-none hover:-translate-y-1 hover:shadow-xl",
		className
	)}
>
	<!-- Background Image -->
	{#if set.cover}
		<CloudinaryImage
			publicId={set.cover.url}
			alt={set.cover.alt || set.title}
			fill={true}
			imgClass="transition-transform duration-500 group-hover:scale-105"
			width={800}
			height={600}
		/>
	{:else}
		<!-- Fallback gradient background -->
		<div class="bg-primary/10 from-primary/20 to-primary/5 absolute inset-0 bg-linear-to-br">
			<!-- Fallback Texture -->
			<div
				class="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,var(--color-text)_1px,transparent_0)] bg-size-[24px_24px] opacity-5"
			></div>
		</div>
	{/if}

	<!-- Folder Icon - Top Left (Set Identifier) -->
	<div class="absolute top-4 left-4 z-20">
		<div
			class="flex items-center justify-center rounded-sm border border-white/10 bg-black/40 p-2 backdrop-blur-md transition-all duration-300 group-hover:border-white/20 group-hover:bg-black/50"
		>
			<FolderOpen size={16} class="text-white/90" />
		</div>
	</div>

	<!-- Count Badge - Top Right -->
	<div class="absolute top-4 right-4 z-20">
		<span
			class="flex items-center gap-1.5 rounded-sm border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all duration-300 group-hover:border-white/20 group-hover:bg-black/50"
		>
			{set.count}
			{set.count === 1 ? "Nota" : "Notas"}
		</span>
	</div>

	<!-- Gradient Overlay -->
	<div
		class="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end gap-2 bg-black/60 p-5 pt-24 backdrop-blur-xl transition-all duration-300"
		style="mask-image: linear-gradient(to bottom, transparent 0%, black 50%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 50%);"
	>
		<!-- Title -->
		<h3 class="font-heading text-xl leading-tight font-bold text-white">
			{set.title}
		</h3>

		<!-- Description -->
		{#if set.description}
			<p class="line-clamp-2 font-mono text-sm text-white/80">
				{set.description}
			</p>
		{:else}
			<p class="line-clamp-2 font-mono text-sm text-white/80">Uma coleção curada no jardim.</p>
		{/if}
	</div>
</a>
