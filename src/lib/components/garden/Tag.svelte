<!-- src/lib/components/garden/Tag.svelte -->
<script lang="ts">
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

<button
	type="button"
	{disabled}
	onclick={handleClick}
	class="border-border-default text-text-muted hover:border-brand-primary/30 hover:bg-brand-primary/5 hover:text-text-heading inline-flex cursor-pointer items-center rounded border px-2 py-0.5 text-[11px] font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
>
	<span class="mr-0.5 opacity-40">#</span>
	{tag}
</button>
