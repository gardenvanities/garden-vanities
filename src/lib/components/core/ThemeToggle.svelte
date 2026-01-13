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

<div
	class="flex items-center gap-1 rounded-full border border-dashed border-zinc-300 p-1 dark:border-zinc-700"
>
	{#each options as option (option.value)}
		{@const Icon = option.icon}
		{@const isActive = theme === option.value}
		<button
			type="button"
			class="flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200
                {isActive
				? 'border border-zinc-400 text-zinc-900 dark:border-zinc-500 dark:text-zinc-100'
				: 'border border-transparent text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'}"
			onclick={() => selectTheme(option.value)}
			aria-label={option.label}
			aria-pressed={isActive}
		>
			<Icon size={14} />
		</button>
	{/each}
</div>
