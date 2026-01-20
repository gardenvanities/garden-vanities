<script lang="ts">
	import type { ConsumptionStatus } from "$lib/modules/library/types";
	import { STATUS_LABELS } from "$lib/modules/library/types";

	interface Props {
		status: ConsumptionStatus;
		size?: "sm" | "md" | "lg";
	}

	let { status, size = "md" }: Props = $props();

	const statusColors: Record<ConsumptionStatus, string> = {
		queued: "bg-amber-500/20 text-amber-400 border-amber-500/30",
		consuming: "bg-blue-500/20 text-blue-400 border-blue-500/30",
		completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
		abandoned: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
	};

	const statusIcons: Record<ConsumptionStatus, string> = {
		queued: "⏳",
		consuming: "📖",
		completed: "✓",
		abandoned: "✕"
	};

	const sizeClasses = {
		sm: "px-2 py-0.5 text-xs",
		md: "px-2.5 py-1 text-sm",
		lg: "px-3 py-1.5 text-base"
	};
</script>

<span
	class="inline-flex items-center gap-1 rounded-full border backdrop-blur-sm {statusColors[status]} {sizeClasses[size]}"
>
	<span class="text-[0.75em]">{statusIcons[status]}</span>
	<span>{STATUS_LABELS[status]}</span>
</span>
