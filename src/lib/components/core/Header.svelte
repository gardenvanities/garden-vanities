<script lang="ts">
	import { page } from "$app/state";
	import Button from "$lib/components/core/Button.svelte";
	import ThemeToggle from "$lib/components/core/ThemeToggle.svelte";
	import { Search, Menu, X } from "@lucide/svelte";
	import Container from "$lib/components/layout/Container.svelte";
	import { slide } from "svelte/transition";

	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	const links = [
		{ label: "Jardim", href: "/garden" },
		{ label: "Artigos", href: "/posts" },
		{ label: "Séries", href: "/series" },
		{ label: "Sobre", href: "/about" }
	];

	const isActive = (path: string) => page.url.pathname.startsWith(path);
</script>

<header
	class="bg-surface-base/80 sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-md transition-all"
>
	<Container class="flex h-16 items-center justify-between" size="lg">
		<!-- Logo -->
		<a href="/" class="group flex items-center gap-2">
			<div
				class="bg-brand-primary h-2 w-2 rounded-full transition-transform group-hover:scale-125"
			></div>
			<span class="text-text-heading font-serif text-lg font-bold tracking-tight">Garden</span>
		</a>

		<!-- Desktop Navigation -->
		<nav class="hidden items-center gap-6 md:flex">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="hover:text-brand-primary text-sm font-medium transition-colors {isActive(link.href)
						? 'text-brand-primary'
						: 'text-text-muted'}"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<!-- Actions -->
		<div class="flex items-center gap-2">
			<Button
				variant="ghost"
				size="sm"
				class="hidden px-2! sm:inline-flex"
				onclick={() => {
					import("$lib/stores/command-palette.svelte").then((m) => m.commandPalette.open());
				}}
			>
				<Search size={18} />
			</Button>

			<!-- Theme Toggle -->
			<ThemeToggle />

			<!-- Mobile Menu Button -->
			<Button variant="ghost" size="sm" class="px-2! md:hidden" onclick={toggleMenu}>
				{#if isMenuOpen}
					<X size={20} />
				{:else}
					<Menu size={20} />
				{/if}
			</Button>
		</div>
	</Container>

	<!-- Mobile Navigation (Slide Down) -->
	{#if isMenuOpen}
		<div
			transition:slide={{ duration: 200, axis: "y" }}
			class="border-border-default bg-surface-base border-b md:hidden"
		>
			<Container class="space-y-2 py-4">
				{#each links as link (link.href)}
					<a
						href={link.href}
						class="block rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-white/5 {isActive(
							link.href
						)
							? 'text-brand-primary bg-brand-primary/5'
							: 'text-text-body'}"
						onclick={() => (isMenuOpen = false)}
					>
						{link.label}
					</a>
				{/each}
			</Container>
		</div>
	{/if}
</header>
