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
		Mail
	} from "@lucide/svelte";
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
	title="{author.name} | Garden of Vanities"
	description={author.bio || `Perfil de ${author.name}`}
/>

<Section class="py-12 md:py-24">
	<Container size="md">
		<!-- Profile Identity -->
		<div class="flex flex-col items-center text-center">
			
            <!-- Avatar -->
			<div class="mb-8 relative">
				<div class="relative h-40 w-40 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
					{#if author.avatar}
						<img
							src={buildCloudinaryUrl(author.avatar, { width: 400, height: 400, crop: "fill" })}
							alt={author.name}
							class="h-full w-full object-cover"
						/>
						<div class="absolute inset-0 bg-linear-to-tr from-black/0 via-white/5 to-white/10 pointer-events-none"></div>
					{:else}
						<div
							class="flex h-full w-full items-center justify-center bg-surface text-5xl font-bold text-primary"
						>
							{author.name.charAt(0)}
						</div>
					{/if}
				</div>
			</div>

            <!-- Name & Vulgo -->
            <div class="mb-6">
                <h1 class="font-heading text-4xl font-bold tracking-tight text-text md:text-5xl">
                    {author.name}
                </h1>
                {#if author.nick}
                    <p class="mt-2 text-lg text-muted font-medium flex items-center gap-2 justify-center">
                        <span class="text-primary text-sm">✦</span>
                        <span class="text-primary">The Mage King</span>
                        <span class="text-primary text-sm">✦</span>
                    </p>
                {/if}
            </div>

			{#if author.bio}
				<p class="mb-8 max-w-3xl text-lg leading-relaxed text-muted/90 font-mono">
					{author.bio}
				</p>
			{/if}

			<!-- Social Links -->
			{#if socialLinks.length > 0}
				<div class="mb-12 flex flex-wrap justify-center gap-3">
					{#each socialLinks as link}
						{@const url = author.social?.[link.key as keyof typeof author.social]}
						{#if url && link.icon}
							<a
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								class="group flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:scale-110"
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
                            class="group flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:scale-110"
                            aria-label="Email"
                        >
                            <Mail size={20} strokeWidth={1.5} />
                        </a>
                    {/if}
				</div>
			{/if}
		</div>

        <!-- Divider -->
        <div class="my-12 h-px w-full bg-border/50"></div>

		<!-- Stats Section -->
		<div>
            <h2 class="mb-8 text-center font-heading text-lg font-semibold uppercase tracking-wider text-muted">Thinking & Building</h2>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<!-- Artigos -->
                <div class="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all hover:border-primary/20 hover:bg-surface-elevated/50">
                     <span class="mb-2 text-4xl font-bold text-text tabular-nums">{stats.articles}</span>
                     <span class="text-sm font-medium text-muted">Artigos Escritos</span>
                </div>

                <!-- Livros -->
                 <div class="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all hover:border-primary/20 hover:bg-surface-elevated/50">
                     <span class="mb-2 text-4xl font-bold text-text tabular-nums">{stats.booksRead}</span>
                     <span class="text-sm font-medium text-muted">Livros Lidos</span>
                </div>

                <!-- Projetos -->
                 <div class="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all hover:border-primary/20 hover:bg-surface-elevated/50">
                     <span class="mb-2 text-4xl font-bold text-text tabular-nums">{stats.projects}</span>
                     <span class="text-sm font-medium text-muted">Projetos</span>
                </div>
			</div>
		</div>

        <!-- Navigation (Optional, keeping it simple as grid below?) User didn't strictly ask to remove it but "Refaça a pagina" implies a full rebuild. 
             The prompt asks for "Name, Bio, Socials, Photo, Stats". Extra navigation might clutter. 
             I will remove the previous large navigation grid to focus on the requested elements, sticking to the "Refaça" instruction strictly. -->
	</Container>
</Section>
