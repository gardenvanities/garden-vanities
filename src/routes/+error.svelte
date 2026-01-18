<script lang="ts">
	import { page } from "$app/state";
	import Section from "$lib/layout/Section.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Button from "$lib/ui/Button.svelte";
	import SEO from "$lib/core/seo/SEO.svelte";
	import { Sprout, MoveLeft, Home } from "@lucide/svelte";

	const status = $derived(page.status);
	const message = $derived(page.error?.message || "Algo deu errado");
</script>

<SEO title="{status}: Página não encontrada" noindex={true} />

<Section class="flex grow items-center justify-center py-20!">
	<Container size="sm" class="flex flex-col items-center text-center">
		<div class="relative mb-8">
			<div
				class="bg-primary/10 border-primary/20 flex h-24 w-24 items-center justify-center rounded-full border"
			>
				<Sprout size={48} class="text-primary" strokeWidth={1.5} />
			</div>

			<div class="text-muted/20 absolute -top-2 -right-2 rotate-12">
				<span class="text-4xl">?</span>
			</div>
			<div class="text-muted/20 absolute -bottom-2 -left-2 -rotate-12">
				<span class="text-4xl">!</span>
			</div>
		</div>

		<h1 class="text-heading/5 font-serif text-9xl leading-none font-black select-none">
			{status}
		</h1>

		<div class="relative z-10 -mt-8 mb-8 space-y-4">
			<h2 class="text-heading text-2xl font-bold sm:text-3xl">
				{#if status === 404}
					Ops! Caminho sem saída.
				{:else}
					Algo quebrou no jardim.
				{/if}
			</h2>
			<p class="text-muted mx-auto max-w-md text-base leading-relaxed">
				{#if status === 404}
					Você alcançou a fronteira do reino. Como o vento, o que você buscava se esvaiu. Tudo é
					vaidade.
				{:else}
					{message}
				{/if}
			</p>
		</div>

		<div class="flex flex-wrap items-center justify-center gap-4">
			<Button href="/" variant="primary" size="md">
				<Home size={18} />
				Início
			</Button>
			<Button onclick={() => history.back()} variant="outline" size="md">
				<MoveLeft size={18} />
				Voltar
			</Button>
		</div>
	</Container>
</Section>
