<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Section from "$lib/layout/Section.svelte";
	import Container from "$lib/layout/Container.svelte";
	import { buildCloudinaryUrl } from "$lib/shared/cloudinary";
	import { Twitter, Instagram, Youtube, Github, Mail } from "@lucide/svelte";
	import type { Author } from "$lib/modules/author/types";

	interface Props {
		data: {
			author: Author;
			stats: {
				articles: number;
				projects: number;
				booksRead: number;
			};
		};
	}

	let { data }: Props = $props();
	const author = $derived(data.author);
	const stats = $derived(data.stats);

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

<Section class="py-12 md:py-24">
	<Container size="lg">
		<!-- Profile Identity -->
		<div class="flex flex-col items-center text-center">
			<!-- Avatar -->
			<div class="relative mb-8">
				<div
					class="border-border bg-surface relative h-40 w-40 overflow-hidden rounded-xl border shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
				>
					{#if author.avatar}
						<img
							src={buildCloudinaryUrl(author.avatar, { width: 400, height: 400, crop: "fill" })}
							alt={author.name}
							class="h-full w-full object-cover"
						/>
						<div
							class="pointer-events-none absolute inset-0 bg-linear-to-tr from-black/0 via-white/5 to-white/10"
						></div>
					{:else}
						<div
							class="bg-surface text-primary flex h-full w-full items-center justify-center text-5xl font-bold"
						>
							{author.name.charAt(0)}
						</div>
					{/if}
				</div>
			</div>

			<!-- Name & Vulgo -->
			<div class="mb-6">
				<h1 class="font-heading text-text text-4xl font-bold tracking-tight md:text-5xl">
					{author.name}
				</h1>
				{#if author.nick}
					<p class="text-muted mt-2 flex items-center justify-center gap-2 text-lg font-medium">
						<span class="text-primary text-sm">✦</span>
						<span class="text-primary">The Mage King</span>
						<span class="text-primary text-sm">✦</span>
					</p>
				{/if}
			</div>

			{#if author.bio}
				<p class="text-muted/90 mb-8 max-w-3xl font-mono text-lg leading-relaxed">
					{author.bio}
				</p>
			{/if}

			<!-- Social Links -->
			{#if socialLinks.length > 0}
				<div class="mb-12 flex flex-wrap justify-center gap-3">
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

		<!-- Divider -->
		<div class="bg-border/50 my-12 h-px w-full"></div>

		<!-- Stats Section -->
		<div>
			<h2
				class="font-heading text-muted mb-8 text-center text-lg font-semibold tracking-wider uppercase"
			>
				Thinking & Building
			</h2>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<!-- Artigos -->
				<div
					class="group border-border bg-surface hover:border-primary/20 hover:bg-surface-elevated/50 relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border p-6 transition-all"
				>
					<span class="text-text mb-2 text-4xl font-bold tabular-nums">{stats.articles}</span>
					<span class="text-muted text-sm font-medium">Artigos Escritos</span>
				</div>

				<!-- Livros -->
				<div
					class="group border-border bg-surface hover:border-primary/20 hover:bg-surface-elevated/50 relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border p-6 transition-all"
				>
					<span class="text-text mb-2 text-4xl font-bold tabular-nums">{stats.booksRead}</span>
					<span class="text-muted text-sm font-medium">Livros Lidos</span>
				</div>

				<!-- Projetos -->
				<div
					class="group border-border bg-surface hover:border-primary/20 hover:bg-surface-elevated/50 relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border p-6 transition-all"
				>
					<span class="text-text mb-2 text-4xl font-bold tabular-nums">{stats.projects}</span>
					<span class="text-muted text-sm font-medium">Projetos</span>
				</div>
			</div>
		</div>
	</Container>
</Section>
