<script lang="ts">
	import Badge from "$lib/ui/Badge.svelte";
	import type { ConsumptionStatus } from "$lib/modules/library/types";
	import { STATUS_LABELS } from "$lib/modules/library/types";

	interface Props {
		status: ConsumptionStatus;
		size?: "sm" | "md";
	}

	let { status, size = "sm" }: Props = $props();

	const variantMap: Record<
		ConsumptionStatus,
		"default" | "primary" | "glass" | "outline" | "secondary"
	> = {
		queued: "glass",
		consuming: "primary",
		completed: "outline",
		abandoned: "secondary",
		"to-read": "glass",
		"to-watch": "glass",
		"to-listen": "glass",
		"to-play": "glass",
		"in-progress": "primary"
	};
</script>

<Badge variant={variantMap[status]} {size}>
	{STATUS_LABELS[status]}
</Badge>
