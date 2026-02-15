<script lang="ts">
	import { Search, X, ChevronDown, Check } from "@lucide/svelte";
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";

	interface Props {
		sortBy: "newest" | "oldest" | "az";
		searchQuery: string;
	}

	let { sortBy = $bindable("newest"), searchQuery = $bindable("") }: Props = $props();

	let isOpen = $state(false);
	let menuRef = $state<HTMLDivElement | null>(null);
	let triggerRef = $state<HTMLButtonElement | null>(null);

	const featureKinds = [
		{ label: "Todos", value: "all" },
		{ label: "Notas", value: "note" },
		{ label: "Ensaios", value: "essay" },
		{ label: "Tutoriais", value: "tutorial" },
		{ label: "Pensamentos", value: "thought" }
	];

	function getActiveKind() {
		for (const kind of featureKinds) {
			if (kind.value !== "all" && searchQuery.includes(`?${kind.value}`)) {
				return kind;
			}
		}
		return featureKinds[0]; // "Todos"
	}

	let activeKind = $derived(getActiveKind());

	function selectKind(kindValue: string) {
		// Remove existing kinds
		featureKinds.forEach((k) => {
			if (k.value !== "all") {
				const token = `?${k.value}`;
				if (searchQuery.includes(token)) {
					searchQuery = searchQuery.replace(token, "").trim();
				}
			}
		});

		// Add new kind if not "all"
		if (kindValue !== "all") {
			searchQuery = `${searchQuery} ?${kindValue}`.trim();
		}

		// Clean up spaces
		searchQuery = searchQuery.replace(/\s{2,}/g, " ");
		isOpen = false;
	}

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}

	function resizeTextarea(el: HTMLTextAreaElement) {
		el.style.height = "auto";
		el.style.height = Math.min(el.scrollHeight, 100) + "px"; // limit to approx 4 lines
	}

	onMount(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				isOpen &&
				menuRef &&
				!menuRef.contains(event.target as Node) &&
				triggerRef &&
				!triggerRef.contains(event.target as Node)
			) {
				closeMenu();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	});
</script>

<div class="flex flex-col gap-6">
	<!-- Search Bar Container -->
	<div class="relative z-20">
		<div
			class="bg-background focus-within:ring-ring border-input flex h-auto min-h-[3rem] w-full items-stretch rounded-2xl border shadow-sm transition-all focus-within:ring-2 focus-within:outline-none hover:shadow-md"
		>
			<!-- Dropdown Trigger -->
			<button
				bind:this={triggerRef}
				onclick={toggleMenu}
				class="hover:bg-muted/50 flex items-center gap-2 rounded-l-2xl px-4 text-sm font-medium transition-colors"
				aria-label="Filtrar por tipo"
				aria-expanded={isOpen}
			>
				<span>{activeKind.label}</span>
				<ChevronDown
					class="text-muted-foreground h-4 w-4 transition-transform duration-200 {isOpen
						? 'rotate-180'
						: ''}"
				/>
			</button>

			<!-- Divider -->
			<div class="bg-border my-2 w-px shrink-0 self-stretch"></div>

			<!-- Search Input -->
			<div class="relative flex-1 py-1">
				<Search class="text-muted-foreground absolute top-3.5 left-3 h-4 w-4" />
				<textarea
					bind:value={searchQuery}
					oninput={(e) => resizeTextarea(e.currentTarget)}
					rows="1"
					placeholder="Buscar... #tag"
					class="placeholder:text-muted-foreground min-h-44px flex w-full resize-none overflow-hidden border-none bg-transparent py-2.5 pr-10 pl-9 text-base focus:ring-0 focus:outline-none"
					style="height: 44px;"
				></textarea>
				{#if searchQuery}
					<button
						onclick={() => {
							searchQuery = "";
						}}
						class="text-muted-foreground hover:text-foreground absolute top-3.5 right-3 p-1 transition-colors"
						aria-label="Limpar busca"
					>
						<X class="h-4 w-4" />
					</button>
				{/if}
			</div>
		</div>

		<!-- Dropdown Menu -->
		{#if isOpen}
			<div
				bind:this={menuRef}
				transition:fly={{ y: 10, duration: 200 }}
				class="bg-surface-elevated animate-in fade-in zoom-in-95 min-w-200px border-border absolute top-14 left-0 z-50 overflow-hidden rounded-xl border p-1 shadow-lg"
			>
				<div class="flex flex-col gap-0.5">
					{#each featureKinds as kind (kind.value)}
						<button
							onclick={() => selectKind(kind.value)}
							class="text-text hover:bg-surface-hover flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors"
						>
							<span>{kind.label}</span>
							{#if activeKind.value === kind.value}
								<Check class="text-primary h-4 w-4" />
							{/if}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<!-- Sort (Right Aligned) -->
	<div class="flex justify-end">
		<div class="min-w-160px relative">
			<select
				bind:value={sortBy}
				class="border-input bg-background hover:bg-muted/50 focus-visible:ring-ring h-10 w-full appearance-none rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				aria-label="Ordenar por"
			>
				<option value="newest">Mais Recentes</option>
				<option value="oldest">Mais Antigas</option>
				<option value="az">De A a Z</option>
			</select>
			<div
				class="text-muted-foreground pointer-events-none absolute inset-y-0 right-3 flex items-center"
			>
				<ChevronDown class="h-4 w-4" />
			</div>
		</div>
	</div>
</div>
