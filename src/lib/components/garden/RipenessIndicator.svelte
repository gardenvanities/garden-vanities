<!-- src/lib/components/posts/RipenessIndicator.svelte -->
<script lang="ts">
	import type { Ripeness } from '$lib/types';
	import { Sprout, Flower, TreeDeciduous } from 'lucide-svelte';

	export let ripeness: Ripeness;

	const config = {
		seed: {
			icon: Sprout,
			label: 'Seed',
			description: 'Early idea, still forming',
			class: 'text-amber-600 bg-amber-50'
		},
		bud: {
			icon: Flower,
			label: 'Bud',
			description: 'Growing, work in progress',
			class: 'text-green-600 bg-green-50'
		},
		bloom: {
			icon: TreeDeciduous,
			label: 'Bloom',
			description: 'Mature, fully developed',
			class: 'text-emerald-700 bg-emerald-50'
		}
	};

	$: current = config[ripeness];
</script>

<span
	class="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium {current.class}"
	title={current.description}
>
	<svelte:component this={current.icon} class="h-3.5 w-3.5" />
	{current.label}
</span>
