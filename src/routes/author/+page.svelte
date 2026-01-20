<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Section from "$lib/layout/Section.svelte";
	import Container from "$lib/layout/Container.svelte";
	import { buildCloudinaryUrl } from "$lib/shared/cloudinary";
	import {
		Twitter,
		Instagram,
		Youtube,
		Github,
		Clock,
		Library,
		Compass,
		FolderOpen,
		Layers,
		Mail
	} from "@lucide/svelte";
	import type { Author } from "$lib/modules/author/types";

	interface Props {
		data: {
			author: Author;
		};
	}

	let { data }: Props = $props();
	const author = $derived(data.author);

	// Social link configuration with icons and colors
	const socialLinks = $derived(
		[
			{ key: "twitter", icon: Twitter, label: "Twitter", color: "#1DA1F2" },
			{ key: "instagram", icon: Instagram, label: "Instagram", color: "#E4405F" },
			{ key: "youtube", icon: Youtube, label: "YouTube", color: "#FF0000" },
			{ key: "github", icon: Github, label: "GitHub", color: "#ffffff" },
			{ key: "tiktok", icon: null, label: "TikTok", color: "#000000" }
		].filter((link) => author.social?.[link.key as keyof typeof author.social])
	);

	// Navigation links to other pages
	const navLinks = [
		{
			href: "/activities",
			icon: Clock,
			title: "Atividades",
			description: "O que estou fazendo"
		},
		{
			href: "/library",
			icon: Library,
			title: "Biblioteca",
			description: "Livros e recursos"
		},
		{
			href: "/explore",
			icon: Compass,
			title: "Explorar",
			description: "Todos os posts"
		},
		{
			href: "/sets",
			icon: FolderOpen,
			title: "Coleções",
			description: "Posts agrupados"
		},
		{
			href: "/series",
			icon: Layers,
			title: "Séries",
			description: "Posts sequenciais"
		}
	];
</script>

<SEO
	title="{author.name} | Garden of Vanities"
	description={author.bio || `Perfil de ${author.name}`}
/>

<Section class="py-16 md:py-24">
	<Container size="sm">
		<!-- Hero Section -->
		<div class="mb-16 flex flex-col items-center text-center">
			<!-- Avatar with glow effect -->
			<div class="relative mb-8">
				<!-- Glow background -->
				<div
					class="absolute inset-0 rounded-full bg-primary/30 blur-2xl transition-all duration-500"
				></div>

				<!-- Avatar image -->
				<div
					class="relative h-36 w-36 overflow-hidden rounded-full border-2 border-primary/30 shadow-xl md:h-44 md:w-44"
				>
					{#if author.avatar}
						<img
							src={buildCloudinaryUrl(author.avatar, { width: 400, height: 400, crop: "fill" })}
							alt={author.name}
							class="h-full w-full object-cover"
						/>
					{:else}
						<div
							class="flex h-full w-full items-center justify-center bg-surface text-4xl font-bold text-primary"
						>
							{author.name.charAt(0)}
						</div>
					{/if}
				</div>
			</div>

			<!-- Name -->
			<h1 class="font-heading mb-3 text-4xl font-bold tracking-tight text-text md:text-5xl">
				{author.name}
			</h1>

			<!-- Role badge -->
			{#if author.role}
				<div
					class="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
				>
					{author.role}
				</div>
			{/if}

			<!-- Bio -->
			{#if author.bio}
				<p class="max-w-lg text-lg leading-relaxed text-muted">
					{author.bio}
				</p>
			{/if}
		</div>

		<!-- Social Links -->
		{#if socialLinks.length > 0}
			<div class="mb-16">
				<h2 class="mb-6 text-center font-heading text-lg font-semibold text-text">
					Redes Sociais
				</h2>
				<div class="flex flex-wrap items-center justify-center gap-4">
					{#each socialLinks as link}
						{@const url = author.social?.[link.key as keyof typeof author.social]}
						{#if url && link.icon}
							<a
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								class="group relative flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
								aria-label={link.label}
							>
								<link.icon
									size={24}
									class="text-muted transition-colors duration-300 group-hover:text-primary"
								/>
							</a>
						{/if}
					{/each}

					<!-- Email link -->
					{#if author.social?.email}
						<a
							href="mailto:{author.social.email}"
							class="group relative flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
							aria-label="Email"
						>
							<Mail
								size={24}
								class="text-muted transition-colors duration-300 group-hover:text-primary"
							/>
						</a>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Quick Navigation -->
		<div>
			<h2 class="mb-6 text-center font-heading text-lg font-semibold text-text">
				Navegue pelo Garden
			</h2>
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each navLinks as link}
					<a
						href={link.href}
						class="group flex items-center gap-4 rounded-xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
					>
						<div
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20"
						>
							<link.icon size={24} />
						</div>
						<div>
							<h3 class="font-heading font-semibold text-text transition-colors group-hover:text-primary">
								{link.title}
							</h3>
							<p class="text-sm text-muted">
								{link.description}
							</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</Container>
</Section>
