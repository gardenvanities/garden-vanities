<script lang="ts">
	import { Folder } from "@lucide/svelte";

	interface Props {
		name: string;
		count: number;
		href: string;
	}

	let { name, count, href }: Props = $props();
</script>

<a {href} class="moc-card">
	<div class="moc-icon">
		<Folder size={24} strokeWidth={1.5} />
	</div>
	<div class="moc-content">
		<h3 class="moc-name">{name}</h3>
		<p class="moc-count">{count} {count === 1 ? "nota" : "notas"}</p>
	</div>
</a>

<style>
	.moc-card {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-2);
		text-decoration: none;
		transition: all var(--motion-base) var(--motion-ease);
		box-shadow: var(--shadow-1);
	}

	.moc-card:hover {
		border-color: var(--color-border-vivid);
		box-shadow: var(--shadow-2);
		transform: translateY(-2px);
	}

	.moc-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: var(--color-primary);
		color: var(--color-primary-contrast);
		border-radius: var(--radius-2);
		flex-shrink: 0;
	}

	.moc-content {
		flex: 1;
		min-width: 0;
	}

	.moc-name {
		font-size: var(--type-2);
		font-weight: 600;
		color: var(--color-text);
		margin: 0;
		line-height: var(--line-height-heading);
	}

	.moc-count {
		font-size: var(--type-0);
		color: var(--color-muted);
		margin: var(--space-1) 0 0 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 600;
	}
</style>
