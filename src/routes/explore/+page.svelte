<script lang="ts">
	import SEO from "$lib/core/seo/SEO.svelte";
	import Container from "$lib/layout/Container.svelte";
	import Section from "$lib/layout/Section.svelte";

	import PostList from "$lib/modules/posts/components/PostList.svelte";
	import PageHeader from "$lib/ui/PageHeader.svelte";
	import { Search, X, Hash } from "@lucide/svelte";
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
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const tags = new Set<string>();
		data.posts.forEach((post) => {
			post.tags?.forEach((tag) => tags.add(tag));
		});
		return Array.from(tags).sort();
	});

	let filteredAutocompleteItems = $derived.by(() => {
		if (autocompleteMode === "tag") {
			return availableTags
				.filter(
					(tag) =>
						tag.toLowerCase().includes(autocompleteTerm.toLowerCase()) &&
						!selectedTags.includes(tag)
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
		return kinds.find((k) => k.value === value)?.label || value;
	}
</script>

<SEO
	title="Explorar Biblioteca | Garden of Vanities"
	description="Pesquise e filtre todas as notas do jardim."
/>

<Section class="py-16 md:py-24">
	<Container size="lg">
		<div>
			<!-- Premium Page Header -->
			<!-- Premium Page Header -->
			<PageHeader
				title="Explorar"
				description="Descubra entre {data.posts.length} notas cultivadas"
			/>

			<div class="relative mx-auto mb-16 max-w-3xl">
				<!-- Main Search Bar -->
				<div
					class="search-bar group relative flex flex-wrap items-center gap-2.5 rounded-2xl border px-5 py-4 transition-all duration-300"
					onclick={focusInput}
					onkeydown={(e) => e.key === "Enter" && focusInput()}
					role="button"
					tabindex="0"
				>
					<Search
						class="search-icon text-muted group-focus-within:text-primary transition-colors duration-200"
						size={20}
					/>

					<!-- Selected Kinds -->
					{#each selectedKinds as kind (kind)}
						<div
							transition:slide={{ axis: "x", duration: 200 }}
							class="chip chip-kind flex items-center gap-1.5 rounded-full py-1 pr-2 pl-2.5 text-xs font-semibold tracking-wide uppercase"
						>
							<span class="chip-prefix">!</span>
							{getKindLabel(kind)}
							<button
								onclick={(e) => {
									e.stopPropagation();
									removeKind(kind);
								}}
								class="chip-remove ml-0.5 rounded-full p-0.5 transition-colors"
								aria-label="Remover filtro de tipo"
							>
								<X size={12} />
							</button>
						</div>
					{/each}

					<!-- Selected Tags -->
					{#each selectedTags as tag (tag)}
						<div
							transition:slide={{ axis: "x", duration: 200 }}
							class="chip chip-tag flex items-center gap-1.5 rounded-full py-1 pr-2 pl-2.5 text-xs font-semibold"
						>
							<Hash size={12} class="opacity-70" />
							{tag}
							<button
								onclick={(e) => {
									e.stopPropagation();
									removeTag(tag);
								}}
								class="chip-remove ml-0.5 rounded-full p-0.5 transition-colors"
								aria-label="Remover filtro de tag"
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
						placeholder={selectedTags.length === 0 && selectedKinds.length === 0
							? "Buscar notas..."
							: ""}
						class="search-input text-text placeholder:text-muted/50 min-w-[180px] flex-1 bg-transparent text-base focus:outline-none"
					/>

					{#if searchQuery || selectedTags.length > 0 || selectedKinds.length > 0}
						<button
							onclick={(e) => {
								e.stopPropagation();
								clearFilters();
							}}
							class="clear-btn text-muted hover:text-text hover:bg-surface-hover rounded-lg p-1.5 transition-colors"
							transition:fly={{ x: 10, duration: 200 }}
							aria-label="Limpar todos os filtros"
						>
							<X size={16} />
						</button>
					{/if}
				</div>

				<!-- Autocomplete Dropdown -->
				{#if autocompleteOpen && filteredAutocompleteItems.length > 0}
					<div
						class="autocomplete-dropdown absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl p-1.5"
						transition:fly={{ y: -10, duration: 200 }}
					>
						{#each filteredAutocompleteItems as item, i (typeof item === "string" ? item : item.value)}
							<button
								class="autocomplete-item flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-all duration-150 {i ===
								activeIndex
									? 'active'
									: ''}"
								onclick={() =>
									autocompleteMode === "tag"
										? selectTag(item as string)
										: selectKind((item as { value: string }).value)}
							>
								{#if autocompleteMode === "tag"}
									<Hash size={14} class="opacity-50" />
									<span class="font-medium">{item}</span>
								{:else}
									<span class="text-secondary text-xs font-bold">!</span>
									<span class="font-medium">{(item as { label: string }).label}</span>
								{/if}
							</button>
						{/each}
					</div>
				{/if}

				<!-- Helper Text -->
				<div class="helper-text text-muted/50 mt-4 flex justify-center gap-8 text-xs font-medium">
					<span class="flex items-center gap-2">
						<kbd class="kbd">#</kbd>
						<span>Tags</span>
					</span>
					<span class="flex items-center gap-2">
						<kbd class="kbd">!</kbd>
						<span>Tipos</span>
					</span>
				</div>
			</div>

			<!-- Quick Filters (Optional: if we want to show most popular tags or similar later) -->

			{#if filteredPosts.length > 0}
				<PostList posts={filteredPosts} />
			{:else}
				<div class="py-24 text-center">
					<div
						class="bg-surface-elevated text-muted mb-4 inline-flex items-center justify-center rounded-full p-4"
					>
						<Search size={32} />
					</div>
					<h3 class="text-text mb-2 text-xl font-bold">Nada encontrado</h3>
					<p class="text-muted mx-auto max-w-sm">
						Não conseguimos encontrar nada com esses filtros. Tente remover alguns termos ou buscar
						por outra coisa.
					</p>
					<button onclick={clearFilters} class="text-primary mt-6 font-semibold hover:underline">
						Limpar tudo
					</button>
				</div>
			{/if}
		</div>
	</Container>
</Section>

<style>
	/* Page Header */
	/* Styles removed - using PageHeader component */

	/* Search Bar Container */
	.search-bar {
		background: oklch(from var(--color-surface) l c h / 0.6);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-color: oklch(from var(--color-border) l c h / 0.5);
		box-shadow:
			0 4px 24px -4px oklch(0% 0 0 / 0.08),
			0 0 0 1px oklch(100% 0 0 / 0.02) inset;
	}

	.search-bar:focus-within {
		border-color: oklch(from var(--color-primary) l c h / 0.4);
		box-shadow:
			0 4px 32px -4px oklch(from var(--color-primary) l c h / 0.15),
			0 0 0 1px oklch(from var(--color-primary) l c h / 0.1) inset;
	}

	/* Chips - Kind */
	.chip-kind {
		background: oklch(from var(--color-secondary) l c h / 0.12);
		border: 1px solid oklch(from var(--color-secondary) l c h / 0.25);
		color: var(--color-secondary);
	}

	.chip-kind .chip-prefix {
		opacity: 0.6;
		font-weight: 700;
	}

	.chip-kind .chip-remove:hover {
		background: oklch(from var(--color-secondary) l c h / 0.2);
		color: var(--color-action-destructive);
	}

	/* Chips - Tag */
	.chip-tag {
		background: oklch(from var(--color-primary) l c h / 0.1);
		border: 1px solid oklch(from var(--color-primary) l c h / 0.2);
		color: var(--color-primary);
	}

	.chip-tag .chip-remove:hover {
		background: oklch(from var(--color-primary) l c h / 0.2);
		color: var(--color-action-destructive);
	}

	/* Autocomplete Dropdown */
	.autocomplete-dropdown {
		background: oklch(from var(--color-surface-elevated) l c h / 0.95);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		border: 1px solid oklch(from var(--color-border) l c h / 0.3);
		box-shadow:
			0 16px 48px -12px oklch(0% 0 0 / 0.25),
			0 0 0 1px oklch(100% 0 0 / 0.03) inset;
	}

	.autocomplete-item {
		color: var(--color-text);
	}

	.autocomplete-item:hover {
		background: var(--color-surface-hover);
	}

	.autocomplete-item.active {
		background: oklch(from var(--color-primary) l c h / 0.1);
		color: var(--color-primary);
	}

	/* Helper Text */
	.kbd {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 0.375rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-weight: 500;
		color: var(--color-muted);
	}
</style>
