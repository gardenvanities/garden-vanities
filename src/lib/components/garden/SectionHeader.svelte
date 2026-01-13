<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
		emoji?: string;
	}

	let { title, subtitle, emoji }: Props = $props();
</script>

<header class="section-header">
	{#if emoji}
		<span class="section-emoji">{emoji}</span>
	{/if}
	<div class="section-text">
		<h2 class="section-title">{title}</h2>
		{#if subtitle}
			<p class="section-subtitle">{subtitle}</p>
		{/if}
	</div>
</header>

<style>
	.section-header {
		display: flex;
		align-items: flex-start;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.section-emoji {
		font-size: 2rem;
		line-height: 1;
		flex-shrink: 0;
	}

	.section-text {
		flex: 1;
	}

	.section-title {
		font-family: var(--font-heading);
		font-size: var(--type-4);
		font-weight: 700;
		color: var(--color-text);
		margin: 0;
		line-height: var(--line-height-heading);
	}

	.section-subtitle {
		font-size: var(--type-1);
		color: var(--color-muted);
		margin: var(--space-2) 0 0 0;
		line-height: var(--line-height-body);
	}
</style>
