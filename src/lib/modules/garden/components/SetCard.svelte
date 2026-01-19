<script lang="ts">
	import { cn } from "$lib/shared/merge-class";
	import { buildCloudinaryUrl } from "$lib/shared/cloudinary";
	import { FolderOpen } from "@lucide/svelte";

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
		"group relative block h-72 w-full select-none overflow-hidden rounded-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl",
		className
	)}
>
	<!-- Background Image -->
	{#if set.cover}
		<img
			src={buildCloudinaryUrl(set.cover.url, { width: 800, height: 600, crop: "fill" })}
			alt={set.cover.alt || set.title}
			class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
		/>
	{:else}
		<!-- Fallback gradient background -->
		<div class="bg-primary/10 absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5">
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
		class="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end gap-2 bg-linear-to-t from-black/90 via-black/60 to-transparent p-5 pb-5 pt-20 transition-all duration-300"
	>
		<!-- Title -->
		<h3 class="font-heading text-xl font-bold leading-tight text-white">
			{set.title}
		</h3>

		<!-- Description -->
		{#if set.description}
			<p class="line-clamp-2 text-sm text-white/80">
				{set.description}
			</p>
		{:else}
			<p class="line-clamp-2 text-sm text-white/80">
				Uma coleção curada no jardim.
			</p>
		{/if}
	</div>
</a>
