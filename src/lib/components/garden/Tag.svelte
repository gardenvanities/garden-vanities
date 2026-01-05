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
	class="hover: inline-flex cursor-pointer items-center rounded-md bg-gray-700/50 px-2.5 py-1
         text-xs text-zinc-400 transition-all
         duration-200 hover:bg-gray-700/80 hover:text-gray-200
         disabled:cursor-not-allowed disabled:opacity-50"
>
	<span class="text-zinc-500">#</span>
	{tag}
</button>
