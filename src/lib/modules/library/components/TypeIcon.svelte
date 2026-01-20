<script lang="ts">
	import type { ResourceType } from "$lib/modules/library/types";
	import {
		BookOpen,
		Film,
		Tv,
		Music,
		FileText,
		FlaskConical,
		ListMusic,
		Disc3
	} from "@lucide/svelte";

	interface Props {
		type: ResourceType;
		class?: string;
	}

	let { type, class: className = "" }: Props = $props();

	const iconMap = {
		book: BookOpen,
		film: Film,
		"tv-series": Tv,
		album: Disc3,
		track: Music,
		playlist: ListMusic,
		article: FileText,
		paper: FlaskConical
	};

	const IconComponent = $derived(iconMap[type] || BookOpen);
</script>

<IconComponent class={className} />
