<script lang="ts">
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";
	import { HelpCircle, LogOut, Palette, Settings, Sparkles } from "@lucide/svelte";
	import { cn } from "$lib/shared/merge-class";

	interface Props {
		isExpanded?: boolean;
	}

	let { isExpanded = true }: Props = $props();

	let isOpen = $state(false);
	let menuRef = $state<HTMLDivElement | null>(null);
	let triggerRef = $state<HTMLButtonElement | null>(null);

	const user = {
		name: "Stephan Carvalho",
		handle: "@GardenVanities",
		plan: "Free",
		avatar: "SC"
	};

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
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

	const menuItems = [
		{ label: "Fazer upgrade do plano", icon: Sparkles, action: () => {} },
		{ label: "Personalização", icon: Palette, action: () => {} },
		{ label: "Configurações", icon: Settings, action: () => {} },
		{ label: "Ajuda", icon: HelpCircle, action: () => {} },
		{ label: "Sair", icon: LogOut, action: () => {} }
	];
</script>

<div class="relative w-full">
	{#if isOpen}
		<div
			class="border-border bg-surface-elevated absolute bottom-[calc(100%+var(--spacing-2))] left-0 z-50 w-65 overflow-hidden rounded-lg border p-2 shadow-lg"
			bind:this={menuRef}
			transition:fly={{ y: 10, duration: 200 }}
		>
			<div class="flex items-center gap-3 p-2">
				<div
					class="bg-bg border-border flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold"
				>
					<span>{user.avatar}</span>
				</div>
				<div class="flex flex-col overflow-hidden">
					<span class="text-sm font-semibold">{user.name}</span>
					<span class="text-muted text-xs">{user.handle}</span>
				</div>
			</div>

			<div class="bg-border my-1 h-px opacity-50"></div>

			<div class="flex flex-col gap-0.5">
				{#each menuItems as item (item.label)}
					<button
						class="group text-text hover:bg-surface-hover duration-fast flex items-center gap-3 rounded-md border-none bg-transparent px-3 py-2.5 text-left text-sm transition-colors"
						onclick={item.action}
					>
						<span
							class="text-muted group-hover:text-text duration-fast flex items-center justify-center transition-colors"
						>
							<item.icon size={16} />
						</span>
						<span>{item.label}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<button
		class={cn(
			"text-text hover:bg-surface-hover focus-visible:outline-focus duration-fast flex h-11 w-full items-center gap-3 overflow-hidden rounded-md border-none bg-transparent px-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
		)}
		bind:this={triggerRef}
		onclick={toggleMenu}
		aria-expanded={isOpen}
		aria-label="Menu de usuário"
	>
		<div
			class="bg-surface-elevated border-border text-text flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold"
		>
			<span>{user.avatar}</span>
		</div>
		<div
			class={cn(
				"flex max-w-38 min-w-0 flex-1 flex-col overflow-hidden whitespace-nowrap",
				!isExpanded && "md:max-w-0 md:transition-none"
			)}
		>
			<span class="overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap"
				>{user.name}</span
			>
			<span class="text-muted text-xs">{user.plan}</span>
		</div>
	</button>
</div>
