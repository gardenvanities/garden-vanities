<script lang="ts">
	import SEO from "$lib/components/core/SEO.svelte";
	import Container from "$lib/components/layout/Container.svelte";
	import Section from "$lib/components/layout/Section.svelte";
	import Grid from "$lib/components/layout/Grid.svelte";
	import PostCard from "$lib/components/garden/PostCard.svelte";
	import { Search, X, Sprout, Hash } from "@lucide/svelte";
	import { fly, slide } from "svelte/transition";

	let { data } = $props();

	// State
	let searchQuery = $state("");
	let selectedKinds = $state<string[]>([]);
	let selectedRipeness = $state<string[]>([]);
	let selectedTags = $state<string[]>([]);
	let showSeeds = $state(false);

	// Autocomplete State
	let inputElement = $state<HTMLInputElement>();
	let autocompleteOpen = $state(false);
	let autocompleteTerm = $state("");
	let activeIndex = $state(0);

	const kinds = [
		{ value: "note", label: "Notas" },
		{ value: "essay", label: "Ensaios" },
		{ value: "tutorial", label: "Tutoriais" },
		{ value: "thought", label: "Reflexões" }
	];

	const ripenessLevels = [
		{ value: "root", label: "Raízes (Em progresso)" },
		{ value: "fruit", label: "Frutos (Maduros)" }
	];

	// Extract unique tags from non-seed posts (unless seeds are shown)
	let availableTags = $derived.by(() => {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const tags = new Set<string>();
		data.posts.forEach((post) => {
			if (post.ripeness === "seed" && !showSeeds) return;
			post.tags?.forEach((tag) => tags.add(tag));
		});
		return Array.from(tags).sort();
	});

	// Filtered tags for autocomplete
	let filteredAutocompleteTags = $derived(
		availableTags
			.filter(
				(tag) =>
					tag.toLowerCase().includes(autocompleteTerm.toLowerCase()) && !selectedTags.includes(tag)
			)
			.slice(0, 5)
	);

	// Derived Filter Logic (Strict AND)
	let filteredPosts = $derived(
		data.posts.filter((post) => {
			// 1. Seed Policy
			if (post.ripeness === "seed" && !showSeeds) return false;

			// 2. Search Text
			const searchLower = searchQuery.toLowerCase();
			const matchesSearch =
				searchQuery === "" ||
				post.title.toLowerCase().includes(searchLower) ||
				post.subtitle?.toLowerCase().includes(searchLower) ||
				post.summary?.toLowerCase().includes(searchLower) ||
				post.tags?.some((tag) => tag.toLowerCase().includes(searchLower));

			if (!matchesSearch) return false;

			// 3. Kind Filter (OR within kinds, but AND with other filters)
			if (selectedKinds.length > 0 && (!post.kind || !selectedKinds.includes(post.kind)))
				return false;

			// 4. Ripeness Filter
			if (selectedRipeness.length > 0 && !selectedRipeness.includes(post.ripeness)) return false;

			// 5. Tag Filter
			if (selectedTags.length > 0) {
				const hasAllTags = selectedTags.every((tag) => post.tags?.includes(tag));
				if (!hasAllTags) return false;
			}

			return true;
		})
	);

	function toggleKind(kind: string) {
		selectedKinds = selectedKinds.includes(kind)
			? selectedKinds.filter((k) => k !== kind)
			: [...selectedKinds, kind];
	}

	function toggleRipeness(ripeness: string) {
		selectedRipeness = selectedRipeness.includes(ripeness)
			? selectedRipeness.filter((r) => r !== ripeness)
			: [...selectedRipeness, ripeness];
	}

	function removeTag(tag: string) {
		selectedTags = selectedTags.filter((t) => t !== tag);
	}

	function clearFilters() {
		selectedKinds = [];
		selectedRipeness = [];
		selectedTags = [];
		searchQuery = "";
	}

	// Autocomplete Logic
	function handleInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		const lastWord = value.split(" ").pop() || "";

		if (lastWord.startsWith("#")) {
			autocompleteOpen = true;
			autocompleteTerm = lastWord.slice(1); // remove #
			activeIndex = 0;
		} else {
			autocompleteOpen = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!autocompleteOpen) {
			// If Backspace and input empty, remove last tag
			if (e.key === "Backspace" && searchQuery === "" && selectedTags.length > 0) {
				selectedTags = selectedTags.slice(0, -1);
			}
			return;
		}

		if (e.key === "ArrowDown") {
			e.preventDefault();
			activeIndex = (activeIndex + 1) % filteredAutocompleteTags.length;
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			activeIndex =
				(activeIndex - 1 + filteredAutocompleteTags.length) % filteredAutocompleteTags.length;
		} else if (e.key === "Enter" || e.key === "Tab") {
			e.preventDefault();
			if (filteredAutocompleteTags[activeIndex]) {
				selectTag(filteredAutocompleteTags[activeIndex]);
			}
		} else if (e.key === "Escape") {
			autocompleteOpen = false;
		}
	}

	function selectTag(tag: string) {
		selectedTags = [...selectedTags, tag];

		// Remove the #term from searchQuery
		// We rebuild the query without the last #term segment
		const words = searchQuery.split(" ");
		words.pop(); // remove triggering term
		searchQuery = words.join(" ") + (words.length > 0 ? " " : "");

		autocompleteOpen = false;
		inputElement?.focus();
	}

	// Focus input when clicking container
	function focusInput() {
		inputElement?.focus();
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
				<h1 class="font-heading text-text mb-4 text-5xl font-bold">Biblioteca do Jardim</h1>
				<p class="text-muted text-xl">
					{filteredPosts.length} notas encontradas.
				</p>
			</div>

			<!-- Search & Filter Controls -->
			<div class="bg-surface border-border mb-12 rounded-xl border p-6 shadow-sm">
				<!-- Power Search Bar -->
				<div
					class="bg-surface-elevated border-border focus-within:border-primary focus-within:ring-primary/20 relative mb-8 flex flex-wrap items-center gap-2 rounded-lg border px-4 py-3 transition-all focus-within:ring-4"
					onclick={focusInput}
					onkeydown={(e) => e.key === "Enter" && focusInput()}
					role="button"
					tabindex="0"
				>
					<Search class="text-muted mr-2 shrink-0" size={20} />

					<!-- Selected Tag Chips -->
					{#each selectedTags as tag (tag)}
						<div
							transition:slide={{ axis: "x", duration: 200 }}
							class="bg-primary/10 text-primary border-primary/20 animate-in zoom-in-50 flex items-center gap-1 rounded-md border px-2 py-1 text-sm font-bold"
						>
							<Hash size={12} />
							{tag}
							<button
								onclick={(e) => {
									e.stopPropagation();
									removeTag(tag);
								}}
								class="hover:text-action-destructive ml-1 rounded-full p-0.5 transition-colors"
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
						placeholder={selectedTags.length === 0 ? "Buscar... (digite # para tags)" : ""}
						class="text-text placeholder-muted min-w-[200px] flex-1 bg-transparent text-lg focus:outline-none"
					/>
				</div>

				<!-- Autocomplete Dropdown -->
				{#if autocompleteOpen && filteredAutocompleteTags.length > 0}
					<div
						class="bg-surface border-border absolute z-50 -mt-8 w-[300px] overflow-hidden rounded-lg border shadow-xl"
						transition:fly={{ y: -10, duration: 200 }}
					>
						{#each filteredAutocompleteTags as tag, i (tag)}
							<button
								class="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors {i ===
								activeIndex
									? 'bg-primary/10 text-primary'
									: 'text-text hover:bg-surface-hover'}"
								onclick={() => selectTag(tag)}
							>
								<Hash size={14} class="opacity-50" />
								<span class="font-medium">{tag}</span>
							</button>
						{/each}
					</div>
				{/if}

				<div class="flex flex-col gap-8 md:flex-row">
					<!-- Primary Filters -->
					<div class="flex flex-1 flex-col gap-6 md:flex-row">
						<!-- Kinds -->
						<div>
							<h3 class="text-text mb-3 text-xs font-bold tracking-widest uppercase">Tipo</h3>
							<div class="flex flex-wrap gap-2">
								{#each kinds as kind (kind.value)}
									<button
										onclick={() => toggleKind(kind.value)}
										class="rounded-full px-4 py-1.5 text-sm font-medium transition-all {selectedKinds.includes(
											kind.value
										)
											? 'bg-primary text-primary-contrast shadow-md'
											: 'bg-surface-elevated text-muted hover:text-text hover:bg-surface-hover'}"
									>
										{kind.label}
									</button>
								{/each}
							</div>
						</div>

						<!-- Ripeness -->
						<div>
							<h3 class="text-text mb-3 text-xs font-bold tracking-widest uppercase">Maturidade</h3>
							<div class="flex flex-wrap gap-2">
								{#each ripenessLevels as level (level.value)}
									<button
										onclick={() => toggleRipeness(level.value)}
										class="rounded-full px-4 py-1.5 text-sm font-medium transition-all {selectedRipeness.includes(
											level.value
										)
											? 'bg-primary text-primary-contrast shadow-md'
											: 'bg-surface-elevated text-muted hover:text-text hover:bg-surface-hover'}"
									>
										{level.label}
									</button>
								{/each}

								<!-- Seed Toggle -->
								<button
									onclick={() => (showSeeds = !showSeeds)}
									class="flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-all {showSeeds
										? 'border-border-vivid bg-surface-elevated text-text'
										: 'text-muted/60 hover:text-muted border-transparent'}"
									title="Mostrar/Ocultar Rascunhos"
								>
									<Sprout size={14} />
									<span>Rascunhos</span>
								</button>
							</div>
						</div>
					</div>
				</div>

				{#if selectedKinds.length > 0 || selectedRipeness.length > 0 || selectedTags.length > 0 || searchQuery}
					<div class="border-border mt-6 flex justify-end border-t pt-4" transition:slide>
						<button
							onclick={clearFilters}
							class="text-muted hover:text-action-destructive flex items-center gap-2 text-sm transition-colors"
						>
							<X size={16} />
							Limpar filtros
						</button>
					</div>
				{/if}
			</div>

			<!-- Results -->
			{#if filteredPosts.length > 0}
				<div class="mb-4 flex items-center justify-between">
					<span class="text-muted text-sm font-medium">
						Mostrando {filteredPosts.length} resultados
					</span>
				</div>
				<Grid cols={3} gap="lg">
					{#each filteredPosts as post (post.slug)}
						<div in:fly={{ y: 20, duration: 400 }}>
							<PostCard {post} />
						</div>
					{/each}
				</Grid>
			{:else}
				<div class="py-24 text-center">
					<p class="text-muted text-xl">Nada encontrado para sua busca refinada.</p>
					{#if selectedTags.length > 0}
						<p class="text-muted mt-2 text-sm">
							Tente remover alguns tópicos (chips) para ampliar a busca.
						</p>
					{/if}
					<button onclick={clearFilters} class="text-primary mt-4 font-semibold hover:underline">
						Limpar todos os filtros
					</button>
				</div>
			{/if}
		</div>
	</Container>
</Section>
