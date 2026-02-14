<script lang="ts">
	import {
		User,
		Settings,
		LogOut,
		Sparkles,
		Palette,
		HelpCircle
	} from "@lucide/svelte";
	import { fade, fly } from "svelte/transition";
	import { onMount } from "svelte";

	let { isExpanded = true } = $props();

	let isOpen = $state(false);
	let menuRef = $state<HTMLDivElement | null>(null);
	let triggerRef = $state<HTMLButtonElement | null>(null);

	const user = {
		name: "Stephan Carvalho",
		handle: "@stephancarvalho26",
		plan: "Free",
		avatar: "SC" // Initials for now, could be an image URL
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
			class="absolute bottom-[calc(100%+var(--spacing-2))] left-0 w-[260px] bg-surface-elevated border border-border rounded-lg shadow-lg p-2 z-50 overflow-hidden"
			bind:this={menuRef}
			transition:fly={{ y: 10, duration: 200 }}
		>
			<!-- Header -->
			<div class="flex items-center gap-3 p-2">
				<div class="flex items-center justify-center w-10 h-10 rounded-full bg-bg border border-border text-sm font-semibold">
					<span>{user.avatar}</span>
				</div>
				<div class="flex flex-col overflow-hidden">
					<span class="text-sm font-semibold">{user.name}</span>
					<span class="text-xs text-muted">{user.handle}</span>
				</div>
			</div>

			<div class="h-px bg-border my-1 opacity-50"></div>

			<!-- Menu Items -->
			<div class="flex flex-col gap-0.5">
				{#each menuItems as item}
					<button
						class="flex items-center gap-3 px-3 py-2.5 rounded-md bg-transparent border-none text-text text-sm cursor-pointer text-left transition-colors duration-fast hover:bg-surface-hover group"
						onclick={item.action}
					>
						<span class="flex items-center justify-center text-muted transition-colors duration-fast group-hover:text-text">
							<item.icon size={16} />
						</span>
						<span>{item.label}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<button
		class="flex items-center justify-center gap-3 w-full p-2 rounded-md bg-transparent border-none cursor-pointer text-left text-text overflow-hidden transition-colors duration-fast hover:bg-surface-hover"
		bind:this={triggerRef}
		onclick={toggleMenu}
		aria-expanded={isOpen}
		aria-label="Menu de usuário"
	>
		<div class="flex items-center justify-center w-8 h-8 rounded-full bg-surface-elevated border border-border text-xs font-semibold text-text">
			<span>{user.avatar}</span>
		</div>
		{#if isExpanded}
			<div class="flex flex-col overflow-hidden" transition:fade={{ duration: 100 }}>
				<span class="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{user.name}</span>
				<span class="text-xs text-muted">{user.plan}</span>
			</div>
		{/if}
	</button>
</div>

