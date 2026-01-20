import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ data }) => {
	try {
		const page = await import("../../content/pages/activities.md");

		return {
			...data,
			content: page.default
		};
	} catch (e) {
		console.error("Error loading now page:", e);
		throw error(404, "Página não encontrada");
	}
};
