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

<button type="button" {disabled} onclick={handleClick} class="badge badge--interactive">
	<span class="opacity-40">#</span>
	{tag}
</button>
