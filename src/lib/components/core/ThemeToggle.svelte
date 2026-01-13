<script lang="ts">
	import { Sun, Moon, Monitor } from "@lucide/svelte";
	import { getTheme, setTheme, type Theme } from "$lib/stores/theme.svelte";

	let theme = $derived(getTheme());

	const options: { value: Theme; icon: typeof Sun; label: string }[] = [
		{ value: "system", icon: Monitor, label: "Sistema" },
		{ value: "light", icon: Sun, label: "Claro" },
		{ value: "dark", icon: Moon, label: "Escuro" }
	];

	function selectTheme(newTheme: Theme) {
		setTheme(newTheme);
	}
</script>

<div class="bg-surface flex items-center gap-1 rounded-md p-1">
	{#each options as option (option.value)}
		{@const Icon = option.icon}
		{@const isActive = theme === option.value}
		<button
			type="button"
			class="flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200
                {isActive
				? 'border-border-vivid text-text border'
				: 'text-muted hover:text-text border border-transparent'}"
			onclick={() => selectTheme(option.value)}
			aria-label={option.label}
			aria-pressed={isActive}
		>
			<Icon size={14} />
		</button>
	{/each}
</div>
