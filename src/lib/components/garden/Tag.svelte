<!-- src/lib/components/garden/Tag.svelte -->
<script lang="ts">
	import Badge from "$lib/components/ui/Badge.svelte";

	interface Props {
		tag: string;
		onclick?: (tag: string) => void;
		disabled?: boolean;
	}

	let { tag, onclick, disabled = false }: Props = $props();

	function handleClick() {
		if (disabled) return;
		onclick?.(tag);
	}
</script>

<Badge
	as="button"
	type="button"
	{disabled}
	onclick={handleClick}
	variant="secondary"
	class="group hover:border-primary/50 hover:bg-surface-elevated cursor-pointer rounded-[4px] px-2 py-0.5 transition-all duration-300 hover:shadow-sm"
>
	<span class="group-hover:text-primary opacity-40 transition-colors">#</span>
	<span class="ml-0.5">{tag}</span>
</Badge>
