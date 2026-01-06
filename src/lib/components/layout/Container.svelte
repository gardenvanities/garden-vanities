<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
		class?: string;
		size?: "sm" | "md" | "lg" | "xl" | "full";
	}

	let { children, class: className = "", size = "lg" }: Props = $props();

	const sizes = {
		sm: "max-w-2xl", // Leitura focada (posts)
		md: "max-w-4xl", // Conteúdo padrão
		lg: "max-w-6xl", // Layouts amplos (home, grids)
		xl: "max-w-7xl", // Dashboards ou galerias
		full: "max-w-full"
	};
</script>

<div class="mx-auto w-full px-4 sm:px-6 lg:px-8 {sizes[size]} {className}">
	{@render children()}
</div>
