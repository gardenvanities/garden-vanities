<script lang="ts">
	import { Search, X, ChevronDown, Check } from "@lucide/svelte";
	import type { Kind } from "$lib/modules/posts/types";
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";

	interface Props {
		sortBy: "newest" | "oldest" | "az";
		searchQuery: string;
	}

	let {
		sortBy = $bindable("newest"),
		searchQuery = $bindable("")
	}: Props = $props();

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
		featureKinds.forEach(k => {
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
			class="bg-background focus-within:ring-ring flex min-h-[3rem] h-auto w-full items-stretch rounded-2xl border border-input shadow-sm hover:shadow-md transition-all focus-within:outline-none focus-within:ring-2"
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
				<ChevronDown class="text-muted-foreground h-4 w-4 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" />
			</button>

			<!-- Divider -->
			<div class="bg-border w-px shrink-0 self-stretch my-2"></div>

			<!-- Search Input -->
			<div class="relative flex-1 py-1">
				<Search class="text-muted-foreground absolute left-3 top-3.5 h-4 w-4" />
				<textarea
					bind:value={searchQuery}
					oninput={(e) => resizeTextarea(e.currentTarget)}
					rows="1"
					placeholder="Buscar... #tag"
					class="bg-transparent placeholder:text-muted-foreground flex w-full border-none pl-9 pr-10 py-2.5 text-base focus:outline-none focus:ring-0 resize-none overflow-hidden min-h-[44px]"
					style="height: 44px;"
				></textarea>
				{#if searchQuery}
					<button
						onclick={() => {
							searchQuery = "";
						}}
						class="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors p-1"
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
				class="bg-surface-elevated animate-in fade-in zoom-in-95 absolute top-14 left-0 z-50 min-w-[200px] overflow-hidden rounded-xl border border-border p-1 shadow-lg"
			>
				<div class="flex flex-col gap-0.5">
					{#each featureKinds as kind}
						<button
							onclick={() => selectKind(kind.value)}
							class="text-text hover:bg-surface-hover flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors text-left"
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
		<div class="relative min-w-[160px]">
			<select
				bind:value={sortBy}
				class="h-10 w-full appearance-none rounded-full border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
				aria-label="Ordenar por"
			>
				<option value="newest">Mais Recentes</option>
				<option value="oldest">Mais Antigas</option>
				<option value="az">De A a Z</option>
			</select>
			<div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
				<ChevronDown class="h-4 w-4" />
			</div>
		</div>
	</div>
</div>
