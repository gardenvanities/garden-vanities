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
		Mail,
		Compass,
		Library,
		BookOpen
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
</script>

<SEO
	title="Garden of Vanities | {author.name}"
	description={author.bio || `Perfil de ${author.name}`}
	type="website"
/>

<Section class="py-6 md:py-12">
	<Container size="lg">
		<!-- Profile Identity -->
		<div class="flex flex-col items-start text-left">
			<!-- Single Text Block with Inline Image -->
			<h1
				class="font-heading text-text mb-6 max-w-4xl text-xl font-bold leading-relaxed tracking-tight text-balance md:text-2xl md:leading-relaxed lg:text-3xl lg:leading-relaxed"
			>
				Hey! 👋<br />Eu sou {author.name}
				<span class="inline-flex align-middle">
					<div
						class="border-border bg-surface relative mx-2 h-[1.2em] w-[1.2em] overflow-hidden rounded-lg border shadow-sm transition-transform duration-300 hover:scale-110"
					>
						{#if author.avatar}
							<img
								src={buildCloudinaryUrl(author.avatar, { width: 100, height: 100, crop: "fill" })}
								alt={author.name}
								class="h-full w-full object-cover"
							/>
						{:else}
							<div
								class="bg-surface text-primary flex h-full w-full items-center justify-center text-sm font-bold"
							>
								{author.name.charAt(0)}
							</div>
						{/if}
					</div>
				</span> intelectual e autor deste jardim onde cultivo todo o meu saber.
				<br /> Fique a vontade para explorar! 🔭
			</h1>

		</div>

		<!-- Navigation Section -->
		<div class="mb-12">
			<h2
				class="font-heading text-muted mb-6 text-center text-lg font-semibold tracking-wider uppercase"
			>
				Explore o Jardim
			</h2>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<!-- Explore -->
				<a
					href="/explore"
					class="group border-border bg-surface hover:border-primary/20 hover:bg-surface-elevated/50 relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border p-6 text-center transition-all hover:-translate-y-1"
				>
					<div
						class="bg-surface-elevated text-muted group-hover:text-primary mb-1 flex h-12 w-12 items-center justify-center rounded-full transition-colors"
					>
						<Compass size={24} strokeWidth={1.5} />
					</div>
					<div>
						<h3 class="text-text mb-1 text-lg font-bold">Explorar</h3>
						<p class="text-muted text-sm font-medium">Pesquise em todo o jardim</p>
					</div>
				</a>

				<!-- Collections (Sets) -->
				<a
					href="/sets"
					class="group border-border bg-surface hover:border-primary/20 hover:bg-surface-elevated/50 relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border p-6 text-center transition-all hover:-translate-y-1"
				>
					<div
						class="bg-surface-elevated text-muted group-hover:text-primary mb-1 flex h-12 w-12 items-center justify-center rounded-full transition-colors"
					>
						<Library size={24} strokeWidth={1.5} />
					</div>
					<div>
						<h3 class="text-text mb-1 text-lg font-bold">Coleções</h3>
						<p class="text-muted text-sm font-medium">Notas agrupadas por temas</p>
					</div>
				</a>

				<!-- Series -->
				<a
					href="/series"
					class="group border-border bg-surface hover:border-primary/20 hover:bg-surface-elevated/50 relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border p-6 text-center transition-all hover:-translate-y-1"
				>
					<div
						class="bg-surface-elevated text-muted group-hover:text-primary mb-1 flex h-12 w-12 items-center justify-center rounded-full transition-colors"
					>
						<BookOpen size={24} strokeWidth={1.5} />
					</div>
					<div>
						<h3 class="text-text mb-1 text-lg font-bold">Séries</h3>
						<p class="text-muted text-sm font-medium">Guias e trilhas de aprendizado</p>
					</div>
				</a>
			</div>
		</div>

		<!-- Social Connect Section -->
		<div>
			<h2
				class="font-heading text-muted mb-6 text-center text-lg font-semibold tracking-wider uppercase"
			>
				Conecte-se comigo
			</h2>
			{#if socialLinks.length > 0}
				<div class="mb-8 flex flex-wrap justify-center gap-3">
					{#each socialLinks as link (link.key)}
						{@const url = author.social?.[link.key as keyof typeof author.social]}
						{#if url && link.icon}
							<a
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								class="group border-border bg-surface text-muted hover:border-primary/30 hover:bg-primary/5 hover:text-primary flex h-10 w-10 items-center justify-center rounded-xl border transition-all hover:scale-110"
								aria-label={link.label}
							>
								<link.icon size={20} strokeWidth={1.5} />
							</a>
						{/if}
					{/each}
					<!-- Email link -->
					{#if author.social?.email}
						<a
							href="mailto:{author.social.email}"
							class="group border-border bg-surface text-muted hover:border-primary/30 hover:bg-primary/5 hover:text-primary flex h-10 w-10 items-center justify-center rounded-xl border transition-all hover:scale-110"
							aria-label="Email"
						>
							<Mail size={20} strokeWidth={1.5} />
						</a>
					{/if}
				</div>
			{/if}
		</div>


	</Container>
</Section>
