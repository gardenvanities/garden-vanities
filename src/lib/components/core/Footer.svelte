<script lang="ts">
	import { Github, Twitter, Mail } from "@lucide/svelte";
	const currentYear = new Date().getFullYear();
</script>

<footer class="border-border-default bg-surface-base mt-20 border-t">
	<div class="mx-auto max-w-5xl px-6 py-12">
		<div class="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
			<!-- Branding & About -->
			<div class="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
				<div class="flex items-center gap-2">
					<div class="bg-brand-primary h-2 w-2 animate-pulse rounded-full"></div>
					<span class="text-text-heading font-serif text-lg font-semibold tracking-tight">
						Garden of Vanities
					</span>
				</div>
				<p class="text-text-muted max-w-xs text-sm leading-relaxed">
					Um jardim digital onde ideias sobre design, código e filosofia crescem organicamente.
				</p>
			</div>

			<!-- Quick Links -->
			<nav class="flex flex-col items-center gap-4 md:items-start">
				<span class="text-text-muted text-[10px] font-bold tracking-widest uppercase"
					>Navegação</span
				>
				<ul
					class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium md:flex-col md:gap-3"
				>
					<li>
						<a href="/garden" class="text-text-body hover:text-brand-primary transition-colors">
							O Jardim
						</a>
					</li>
					<li>
						<a href="/posts" class="text-text-body hover:text-brand-primary transition-colors">
							Artigos
						</a>
					</li>
					<li>
						<a href="/author" class="text-text-body hover:text-brand-primary transition-colors">
							Sobre o Autor
						</a>
					</li>
				</ul>
			</nav>

			<!-- Social & Contact -->
			<div class="flex flex-col items-center gap-4 md:items-start">
				<span class="text-text-muted text-[10px] font-bold tracking-widest uppercase">Conectar</span
				>
				<div class="flex gap-4">
					<a
						href="https://github.com/themageking"
						target="_blank"
						rel="noopener noreferrer"
						class="text-text-muted hover:text-text-heading transition-all hover:-translate-y-0.5"
						aria-label="GitHub"
					>
						<Github size={20} />
					</a>
					<a
						href="https://twitter.com/themageking"
						target="_blank"
						rel="noopener noreferrer"
						class="text-text-muted hover:text-text-heading transition-all hover:-translate-y-0.5"
						aria-label="Twitter/X"
					>
						<Twitter size={20} />
					</a>
					<a
						href="mailto:contato@exemplo.com"
						class="text-text-muted hover:text-text-heading transition-all hover:-translate-y-0.5"
						aria-label="Email"
					>
						<Mail size={20} />
					</a>
				</div>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div
			class="border-border-default/50 text-text-muted/60 mt-12 flex flex-col items-center justify-between border-t pt-8 text-[11px] md:flex-row"
		>
			<p>© {currentYear} Garden of Vanities. Todos os direitos reservados.</p>
			<div class="mt-4 flex items-center gap-4 md:mt-0">
				<span>Desenvolvido com Svelte 5</span>
				<span class="bg-text-muted/30 h-1 w-1 rounded-full"></span>
				<span>Pau ferro e alma</span>
			</div>
		</div>
	</div>
</footer>
