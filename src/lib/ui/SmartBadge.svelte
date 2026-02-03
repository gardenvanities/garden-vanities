<script lang="ts">
	import Badge from "$lib/ui/Badge.svelte";
	import type { Component } from "svelte";

	type BadgeConfig = {
		label: string;
		base: string;
		hover: string;
		active: string;
	};

	interface Props {
		config: BadgeConfig;
		icon?: Component;
		active?: boolean;
		showLabel?: boolean;
		iconClass?: string;
		class?: string;
	}

	let {
		config,
		icon: Icon,
		active = false,
		showLabel = true,
		iconClass = "",
		class: className = ""
	}: Props = $props();
</script>

<Badge
	variant="glass"
	class="{className} transition-all duration-300 {active
		? config.active
		: `${config.base} ${config.hover}`}"
>
	{#if Icon}
		<Icon size={14} class="{iconClass} {showLabel ? 'mr-1.5' : ''}" />
	{/if}
	{#if showLabel}
		<span class="pt-px">{config.label}</span>
	{/if}
</Badge>
