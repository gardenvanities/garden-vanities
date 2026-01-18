<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";
	import Grid from "$lib/layout/Grid.svelte";
	import PostCard from "$lib/modules/posts/components/PostCard.svelte";
	import { Search, X, Hash, Info } from "@lucide/svelte";
	import { fly, slide } from "svelte/transition";

	let { data } = $props();

	let searchQuery = $state("");
	let selectedKinds = $state<string[]>([]);
	let selectedTags = $state<string[]>([]);
	
	let inputElement = $state<HTMLInputElement>();
	let autocompleteOpen = $state(false);
	let autocompleteMode = $state<"tag" | "kind">("tag");
	let autocompleteTerm = $state("");
	let activeIndex = $state(0);

	const kinds = [
		{ value: "note", label: "Nota" },
		{ value: "essay", label: "Ensaio" },
		{ value: "tutorial", label: "Tutorial" },
		{ value: "thought", label: "Reflexão" }
	];

	let availableTags = $derived.by(() => {
		const tags = new Set<string>();
		data.posts.forEach((post) => {
			if (post.ripeness === "seed") return;
			post.tags?.forEach((tag) => tags.add(tag));
		});
		return Array.from(tags).sort();
	});

	let filteredAutocompleteItems = $derived.by(() => {
		if (autocompleteMode === "tag") {
			return availableTags
				.filter(
					(tag) =>
						tag.toLowerCase().includes(autocompleteTerm.toLowerCase()) && !selectedTags.includes(tag)
				)
				.slice(0, 5);
		} else {
			return kinds
				.filter(
					(kind) =>
						kind.value.toLowerCase().includes(autocompleteTerm.toLowerCase()) && 
						!selectedKinds.includes(kind.value)
				)
				.slice(0, 5);
		}
	});

	let filteredPosts = $derived(
		data.posts.filter((post) => {
			// Always filter out seeds
			if (post.ripeness === "seed") return false;

			const searchLower = searchQuery.toLowerCase();
			const matchesSearch =
				searchQuery === "" ||
				post.title.toLowerCase().includes(searchLower) ||
				post.subtitle?.toLowerCase().includes(searchLower) ||
				post.summary?.toLowerCase().includes(searchLower) ||
				post.tags?.some((tag) => tag.toLowerCase().includes(searchLower));

			if (!matchesSearch) return false;

			if (selectedKinds.length > 0 && (!post.kind || !selectedKinds.includes(post.kind)))
				return false;

			if (selectedTags.length > 0) {
				const hasAllTags = selectedTags.every((tag) => post.tags?.includes(tag));
				if (!hasAllTags) return false;
			}

			return true;
		})
	);

	function removeTag(tag: string) {
		selectedTags = selectedTags.filter((t) => t !== tag);
	}

	function removeKind(kind: string) {
		selectedKinds = selectedKinds.filter((k) => k !== kind);
	}

	function clearFilters() {
		selectedKinds = [];
		selectedTags = [];
		searchQuery = "";
	}

	function handleInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		const lastWord = value.split(" ").pop() || "";

		if (lastWord.startsWith("#")) {
			autocompleteOpen = true;
			autocompleteMode = "tag";
			autocompleteTerm = lastWord.slice(1);
			activeIndex = 0;
		} else if (lastWord.startsWith("!")) {
			autocompleteOpen = true;
			autocompleteMode = "kind";
			autocompleteTerm = lastWord.slice(1);
			activeIndex = 0;
		} else {
			autocompleteOpen = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!autocompleteOpen) {
			if (e.key === "Backspace" && searchQuery === "") {
				if (selectedKinds.length > 0) {
					// Remove last kind if exists, else last tag
					selectedKinds = selectedKinds.slice(0, -1);
				} else if (selectedTags.length > 0) {
					selectedTags = selectedTags.slice(0, -1);
				}
			}
			return;
		}

		if (filteredAutocompleteItems.length === 0) return;

		if (e.key === "ArrowDown") {
			e.preventDefault();
			activeIndex = (activeIndex + 1) % filteredAutocompleteItems.length;
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			activeIndex =
				(activeIndex - 1 + filteredAutocompleteItems.length) % filteredAutocompleteItems.length;
		} else if (e.key === "Enter" || e.key === "Tab") {
			e.preventDefault();
			const item = filteredAutocompleteItems[activeIndex];
			if (item) {
				if (autocompleteMode === "tag") {
					selectTag(item as string);
				} else {
					selectKind((item as { value: string }).value);
				}
			}
		} else if (e.key === "Escape") {
			autocompleteOpen = false;
		}
	}

	function selectTag(tag: string) {
		selectedTags = [...selectedTags, tag];
		resetInput();
	}

	function selectKind(kindValue: string) {
		selectedKinds = [...selectedKinds, kindValue];
		resetInput();
	}

	function resetInput() {
		const words = searchQuery.split(" ");
		words.pop();
		searchQuery = words.join(" ") + (words.length > 0 ? " " : "");
		autocompleteOpen = false;
		inputElement?.focus();
	}

	function focusInput() {
		inputElement?.focus();
	}

	function getKindLabel(value: string) {
		return kinds.find(k => k.value === value)?.label || value;
	}
</script>

<SEO
	title="Explorar Biblioteca | Garden of Vanities"
	description="Pesquise e filtre todas as notas do jardim."
/>

<Section class="py-12">
	<Container size="lg">
		<div in:fly={{ y: 20, duration: 800 }}>
			<div class="mb-12 text-center">
				<h1 class="font-bold font-header text-5xl mb-4 text-text">Biblioteca do Jardim</h1>
				<p class="text-xl text-muted">
					Explore {filteredPosts.length} notas cultivadas.
				</p>
			</div>

			<div class="max-w-3xl mx-auto mb-16 relative">
				<!-- Main Search Bar -->
				<div
					class="relative flex flex-wrap items-center gap-2 p-4 rounded-2xl bg-surface/50 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-300 focus-within:shadow-[0_8px_40px_rgba(var(--color-primary),0.15)] focus-within:border-primary/30 group"
					onclick={focusInput}
					onkeydown={(e) => e.key === "Enter" && focusInput()}
					role="button"
					tabindex="0"
				>
					<Search class="text-muted group-focus-within:text-primary transition-colors ml-2 mr-1" size={22} />

					<!-- Selected Kinds -->
					{#each selectedKinds as kind (kind)}
						<div
							transition:slide={{ axis: "x", duration: 200 }}
							class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border/50 text-sm font-medium text-text animate-in zoom-in-50"
						>
							<Info size={14} class="text-secondary" />
							{getKindLabel(kind)}
							<button
								onclick={(e) => {
									e.stopPropagation();
									removeKind(kind);
								}}
								class="ml-1 p-0.5 rounded-full hover:bg-surface-hover hover:text-action-destructive transition-colors"
							>
								<X size={12} />
							</button>
						</div>
					{/each}

					<!-- Selected Tags -->
					{#each selectedTags as tag (tag)}
						<div
							transition:slide={{ axis: "x", duration: 200 }}
							class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-sm font-medium text-primary animate-in zoom-in-50"
						>
							<Hash size={12} />
							{tag}
							<button
								onclick={(e) => {
									e.stopPropagation();
									removeTag(tag);
								}}
								class="ml-1 p-0.5 rounded-full hover:bg-primary/20 hover:text-action-destructive transition-colors"
							>
								<X size={12} />
							</button>
						</div>
					{/each}

					<input
						bind:this={inputElement}
						type="text"
						bind:value={searchQuery}
						oninput={handleInput}
						onkeydown={handleKeydown}
						placeholder={selectedTags.length === 0 && selectedKinds.length === 0 ? "Buscar... (use # para tags, ! para tipos)" : ""}
						class="flex-1 min-w-[200px] bg-transparent text-lg text-text placeholder-muted/60 focus:outline-none ml-1"
					/>
					
					{#if searchQuery || selectedTags.length > 0 || selectedKinds.length > 0}
						<button 
							onclick={(e) => {
								e.stopPropagation();
								clearFilters();
							}}
							class="text-muted hover:text-text transition-colors p-2"
							transition:fly={{ x: 10, duration: 200 }}
						>
							<X size={18} />
						</button>
					{/if}
				</div>

				<!-- Autocomplete Dropdown -->
				{#if autocompleteOpen && filteredAutocompleteItems.length > 0}
					<div
						class="absolute top-full left-0 right-0 mt-2 p-1 bg-surface-elevated/95 backdrop-blur-xl border border-white/5 rounded-xl shadow-2xl z-50 overflow-hidden"
						transition:fly={{ y: -10, duration: 200 }}
					>
						{#each filteredAutocompleteItems as item, i}
							<button
								class="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 {i === activeIndex
									? 'bg-primary/10 text-primary'
									: 'text-text hover:bg-surface-hover'}"
								onclick={() => autocompleteMode === 'tag' ? selectTag(item as string) : selectKind((item as {value: string}).value)}
							>
								{#if autocompleteMode === 'tag'}
									<Hash size={14} class="opacity-50" />
									<span class="font-medium">{item}</span>
								{:else}
									<Info size={14} class="opacity-50" />
									<span class="font-medium">{(item as {label: string}).label}</span>
								{/if}
							</button>
						{/each}
					</div>
				{/if}

				<!-- Helper Text -->
				<div class="mt-4 flex justify-center gap-6 text-xs text-muted/60 font-medium uppercase tracking-wider">
					<span class="flex items-center gap-1.5">
						<kbd class="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-sans">#</kbd>
						Filtrar Tags
					</span>
					<span class="flex items-center gap-1.5">
						<kbd class="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-sans">!</kbd>
						Filtrar Tipos
					</span>
				</div>
			</div>

			<!-- Quick Filters (Optional: if we want to show most popular tags or similar later) -->

			{#if filteredPosts.length > 0}
				<Grid cols={3} gap="lg">
					{#each filteredPosts as post (post.slug)}
						<div in:fly={{ y: 20, duration: 400 }}>
							<PostCard {post} />
						</div>
					{/each}
				</Grid>
			{:else}
				<div class="text-center py-24">
					<div class="inline-flex items-center justify-center p-4 rounded-full bg-surface-elevated mb-4 text-muted">
						<Search size={32} />
					</div>
					<h3 class="text-xl font-bold text-text mb-2">Nada encontrado</h3>
					<p class="text-muted max-w-sm mx-auto">
						Não conseguimos encontrar nada com esses filtros. Tente remover alguns termos ou buscar por outra coisa.
					</p>
					<button 
						onclick={clearFilters} 
						class="mt-6 text-primary font-semibold hover:underline"
					>
						Limpar tudo
					</button>
				</div>
			{/if}
		</div>
	</Container>
</Section>
