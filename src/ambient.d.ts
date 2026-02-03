declare module "*.md" {
	import type { ComponentType } from "svelte";
	export const metadata: Record<string, unknown>;
	const component: ComponentType;
	export default component;
}
declare namespace svelteHTML {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface HTMLAttributes<T> {
		onenterViewport?: (event: CustomEvent<void>) => void;
		onexitViewport?: (event: CustomEvent<void>) => void;
	}
}
