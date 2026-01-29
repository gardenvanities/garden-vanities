declare module "*.md" {
	import type { ComponentType } from "svelte";
	export const metadata: Record<string, unknown>;
	const component: ComponentType;
	export default component;
}
