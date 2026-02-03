<script lang="ts">
	import { FolderOpen } from "@lucide/svelte";
	import ContentCard from "$lib/ui/ContentCard.svelte";
	import Badge from "$lib/ui/Badge.svelte";

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

<ContentCard
	title={set.title}
	description={set.description || "Uma coleção curada no jardim."}
	href={set.href}
	cover={set.cover}
	class={className}
>
	{#snippet icon()}
		<FolderOpen size={16} class="text-white/90" />
	{/snippet}

	{#snippet badges()}
		<Badge variant="glass">
			{set.count}
			{set.count === 1 ? "Nota" : "Notas"}
		</Badge>
	{/snippet}
</ContentCard>
