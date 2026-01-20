import { getAuthorByNick, getAllAuthors } from "$lib/modules/author";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
	const authors = getAllAuthors();
	const author = authors[0]; // Get the primary author

	if (!author) {
		throw error(404, "Author not found");
	}

	return {
		author
	};
};
