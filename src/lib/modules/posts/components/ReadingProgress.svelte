<script lang="ts">
	interface Props {
		progress: number; // 0 to 100
		class?: string;
	}

	let { progress = 0, class: className = "" }: Props = $props();
</script>

<div
	class="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[0.875rem] {className}"
>
	<!-- Background Fill -->
	<div
		class="bg-primary/10 absolute bottom-0 left-0 w-full transition-all duration-75 ease-linear"
		style="height: {progress}%;"
	></div>

	<!-- Percentage Text -->
	<span class="text-primary relative z-10 text-[10px] leading-none font-bold tabular-nums">
		{Math.round(progress)}<span class="text-[9px] opacity-80">%</span>
	</span>
</div>
