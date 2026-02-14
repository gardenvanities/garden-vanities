declare module "*.md" {
	import type { ComponentType } from "svelte";
	export const metadata: Record<string, unknown>;
	const component: ComponentType;
	export default component;
}
declare namespace svelteHTML {
	
	interface HTMLAttributes<T> {
		onenterViewport?: (event: CustomEvent<void> & { target: EventTarget & T }) => void;
		onexitViewport?: (event: CustomEvent<void> & { target: EventTarget & T }) => void;
	}
}
