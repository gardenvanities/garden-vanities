<script lang="ts">
	import { readingProgress } from "$lib/stores/reading-progress.svelte";
	import { onMount } from "svelte";

	onMount(() => {
		return readingProgress.init();
	});
</script>

<div class="flex flex-col gap-2 p-3 border-t border-border">
	<div class="flex justify-between items-center text-xs font-medium text-muted">
		<span>Progresso</span>
		<span>{Math.round(readingProgress.percent)}%</span>
	</div>
	
	<div class="w-full h-1 bg-border rounded-sm overflow-hidden">
		<div 
			class="h-full bg-primary transition-[width] duration-100 linear"
			style="width: {readingProgress.spring}%"
		></div>
	</div>

	<div class="text-[0.625rem] text-muted text-right">
		{#if readingProgress.percent < 90}
			<span>{readingProgress.minutesLeft} min restantes</span>
		{:else}
			<span>Leitura concluída</span>
		{/if}
	</div>
</div>

