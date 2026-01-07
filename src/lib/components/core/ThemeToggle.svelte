<script lang="ts">
	import { Sun, Moon, Monitor, ChevronDown } from "lucide-svelte";
	import { getTheme, setTheme, getResolvedTheme, type Theme } from "$lib/stores/theme.svelte";
	import { slide } from "svelte/transition";

	let isOpen = $state(false);
	let theme = $derived(getTheme());
	let resolvedTheme = $derived(getResolvedTheme());

	const options: { value: Theme; label: string; icon: typeof Sun }[] = [
		{ value: "system", label: "Sistema", icon: Monitor },
		{ value: "light", label: "Claro", icon: Sun },
		{ value: "dark", label: "Escuro", icon: Moon }
	];

	function selectTheme(newTheme: Theme) {
		setTheme(newTheme);
		isOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === "Escape") {
			isOpen = false;
		}
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest(".theme-toggle-container")) {
			isOpen = false;
		}
	}

	$effect(() => {
		if (isOpen) {
			document.addEventListener("click", handleClickOutside);
		}
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	});

	// Get the current icon based on resolved theme (for display)
	const CurrentIcon = $derived(resolvedTheme === "dark" ? Moon : Sun);
</script>

<div class="theme-toggle-container relative">
	<button
		type="button"
		class="focus-ring text-text-muted hover:text-text-heading flex h-9 items-center gap-1.5 rounded-lg px-2 transition-colors hover:bg-white/5"
		onclick={() => (isOpen = !isOpen)}
		onkeydown={handleKeydown}
		aria-expanded={isOpen}
		aria-haspopup="listbox"
		aria-label="Alternar tema"
	>
		<CurrentIcon size={18} />
		<ChevronDown
			size={14}
			class="opacity-50 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
		/>
	</button>

	{#if isOpen}
		<div
			transition:slide={{ duration: 150, axis: "y" }}
			class="border-border-default bg-surface-raised absolute top-full right-0 z-50 mt-2 min-w-36 overflow-hidden rounded-lg border shadow-lg"
			role="listbox"
			aria-label="Selecionar tema"
		>
			{#each options as option (option.value)}
				{@const Icon = option.icon}
				<button
					type="button"
					role="option"
					aria-selected={theme === option.value}
					class="hover:bg-brand-primary/10 flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors
						{theme === option.value ? 'text-brand-primary' : 'text-text-body'}"
					onclick={() => selectTheme(option.value)}
				>
					<Icon size={16} class="shrink-0 opacity-70" />
					<span class="font-medium">{option.label}</span>
					{#if theme === option.value}
						<span class="bg-brand-primary ml-auto h-1.5 w-1.5 rounded-full"></span>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
