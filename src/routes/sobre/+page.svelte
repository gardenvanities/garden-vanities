<script lang="ts">
	import { Telescope } from "@lucide/svelte";
</script>

<svelte:head>
	<title>Sobre Nós | Garden of Vanities</title>
	<meta
		name="description"
		content="Saiba mais sobre o Garden of Vanities, um espaço para reflexão e exploração digital."
	/>
</svelte:head>

<div class="mx-auto max-w-3xl px-6 py-24">
	<header class="mb-16 text-center">
		<div
			class="bg-primary/10 text-primary mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
		>
			<Telescope size={32} />
		</div>
		<h1 class="text-text mb-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
			Sobre o Jardim
		</h1>
		<p class="text-muted text-lg">Explorando as vaidades e verdades do mundo digital.</p>
	</header>

	<article class="prose prose-neutral dark:prose-invert max-w-none">
		<p>
			O <strong>Garden of Vanities</strong> é mais do que um blog; é um jardim digital cultivado com curiosidade,
			ceticismo e uma busca constante por significado em meio ao ruído.
		</p>

		<h2 class="text-text mt-12 mb-6 font-heading text-2xl font-bold">A Filosofia</h2>
		<p>
			Inspirado pela sabedoria clássica e pelos dilemas contemporâneos, este espaço busca
			desconstruir as "vaidades" — aquilo que é passageiro, vazio e puramente performático — para
			revelar o que realmente permanece.
		</p>
		<blockquote class="border-primary/30 text-muted my-8 border-l-4 pl-6 font-heading text-xl italic">
			"Vaidade de vaidades, tudo é vaidade."
		</blockquote>

		<h2 class="text-text mt-12 mb-6 font-heading text-2xl font-bold">O Que Encontrar Aqui</h2>
		<ul>
			<li>
				<strong>Artigos:</strong> Reflexões profundas sobre tecnologia, sociedade e existência.
			</li>
			<li>
				<strong>O Jardim:</strong> Uma coleção de notas interconectadas em constante evolução.
			</li>
			<li><strong>Curadoria:</strong> Descobertas e referências que valem o seu tempo.</li>
		</ul>
	</article>

	<div
		class="border-border bg-surface/50 mt-24 rounded-3xl border p-8 text-center backdrop-blur-sm"
	>
		<h3 class="text-text mb-2 font-heading text-xl font-bold">Quer conversar?</h3>
		<p class="text-muted mb-6">Sinta-se à vontade para entrar em contato ou me seguir nas redes.</p>
		<div class="flex justify-center gap-4">
			<a
				href="/author"
				class="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-2 text-sm font-bold transition-colors"
			>
				Conheça o Autor
			</a>
		</div>
	</div>
</div>
