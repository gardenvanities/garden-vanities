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
	class="flex cursor-pointer items-center gap-1.5 rounded-sm border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-black/50 disabled:cursor-not-allowed disabled:opacity-50"
>
	<span class="opacity-60">#</span>
	<span>{tag}</span>
</button>
