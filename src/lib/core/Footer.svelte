<script lang="ts">
	import { Github, Twitter, Mail, Rss } from "@lucide/svelte";
	import ThemeToggle from "$lib/core/theme/ThemeToggle.svelte";
	import { onMount } from "svelte";

	const currentYear = new Date().getFullYear();

	const socialLinks = [
		{ href: "https://github.com/themageking", label: "GitHub", icon: Github },
		{ href: "https://twitter.com/themageking", label: "Twitter", icon: Twitter },
		{ href: "mailto:contato@exemplo.com", label: "Email", icon: Mail },
		{ href: "/rss.xml", label: "RSS Feed", icon: Rss }
	];

	let svgText: SVGTextElement;
	let viewBox = "0 0 0 0";

	onMount(() => {
		const updateBox = () => {
			if (svgText) {
				const { x, y, width, height } = svgText.getBBox();
				// Add padding to prevent letter clipping
				const padding = 10;
				viewBox = `${x - padding} ${y - padding} ${width + padding * 2} ${height + padding * 2}`;
			}
		};

		document.fonts.ready.then(updateBox);
		updateBox();
	});
</script>

<footer class="bg-surface/30 border-border/30 mt-32 border-t">
	<!-- Links Grid -->
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="border-border/30 grid grid-cols-2 gap-8 border-b py-10 sm:gap-10 sm:py-12 lg:grid-cols-4">
			<!-- Navegação -->
			<div>
				<h4 class="font-sans text-muted mb-3 text-[10px] font-bold uppercase tracking-widest sm:mb-4">
					Navegação
				</h4>
				<ul class="list-none p-0 space-y-2 sm:space-y-2.5">
					<li>
						<a href="/explore" class="text-text/80 hover:text-text text-sm transition-colors">
							Explorar
						</a>
					</li>
					<li>
						<a href="/series" class="text-text/80 hover:text-text text-sm transition-colors">
							Séries
						</a>
					</li>
					<li>
						<a href="/sets" class="text-text/80 hover:text-text text-sm transition-colors">
							Coleções
						</a>
					</li>
					<li>
						<a href="/library" class="text-text/80 hover:text-text text-sm transition-colors">
							Biblioteca
						</a>
					</li>
				</ul>
			</div>

			<!-- Conteúdo -->
			<div>
				<h4 class="font-sans text-muted mb-3 text-[10px] font-bold uppercase tracking-widest sm:mb-4">
					Conteúdo
				</h4>
				<ul class="list-none p-0 space-y-2 sm:space-y-2.5">
					<li>
						<a href="/changelog" class="text-text/80 hover:text-text text-sm transition-colors">
							Changelog
						</a>
					</li>
					<li>
						<a href="/tags" class="text-text/80 hover:text-text text-sm transition-colors">
							Tags
						</a>
					</li>
				</ul>
			</div>

			<!-- Sobre -->
			<div>
				<h4 class="font-sans text-muted mb-3 text-[10px] font-bold uppercase tracking-widest sm:mb-4">
					Sobre
				</h4>
				<ul class="list-none p-0 space-y-2 sm:space-y-2.5">
					<li>
						<a href="/about" class="text-text/80 hover:text-text text-sm transition-colors">
							O Jardim
						</a>
					</li>
					<li>
						<a href="/author" class="text-text/80 hover:text-text text-sm transition-colors">
							Autor
						</a>
					</li>
				</ul>
			</div>

			<!-- Conectar -->
			<div>
				<h4 class="font-sans text-muted mb-3 text-[10px] font-bold uppercase tracking-widest sm:mb-4">
					Conectar
				</h4>
				<ul class="list-none p-0 space-y-2 sm:space-y-2.5">
					{#each socialLinks as { href, label, icon }}
						<li>
							<a
								{href}
								target={href.startsWith("http") ? "_blank" : undefined}
								rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
								class="text-text/80 hover:text-text inline-flex items-center gap-2 text-sm transition-colors"
							>
								<svelte:component this={icon} size={14} class="opacity-60" />
								{label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>

	<!-- Brand Text - Fluid Width (fora do container) -->
	<div class="w-full px-4 py-8 sm:px-6 sm:py-10">
		<svg
			{viewBox}
			class="text-text block h-auto w-full select-none"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			<text
				bind:this={svgText}
				x="50%"
				y="50%"
				font-size="100"
				dominant-baseline="central"
				text-anchor="middle"
				class="font-heading fill-current font-bold tracking-tighter"
			>
				Garden of Vanities.
			</text>
		</svg>
		<span class="sr-only">Garden of Vanities.</span>
	</div>

	<!-- Bottom Meta Row -->
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="border-border/30 flex flex-wrap items-center justify-between gap-4 border-t py-5">
			<div class="flex items-center gap-3 sm:gap-4">
				<span class="text-muted/40 text-[10px] sm:text-xs">© {currentYear}</span>
				<div class="bg-border/30 h-3 w-px sm:h-4"></div>
				<span class="text-muted/40 text-[10px] sm:text-xs">SvelteKit</span>
			</div>
			<ThemeToggle />
		</div>
	</div>
</footer>
