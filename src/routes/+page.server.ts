import { getAllPosts } from "$lib/server/posts";
import { getAllSets } from "$lib/server/collections";
import { getResourcesByType } from "$lib/server/library";
import { getAllAuthors } from "$lib/modules/author";
import { setCacheHeaders } from "$lib/server/utils";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ setHeaders }) => {
	setCacheHeaders(setHeaders);

	const authors = getAllAuthors();
	const author = authors[0]; 

	if (!author) {
		throw error(404, "Author not found");
	}

	
	const posts = await getAllPosts();
	const sets = getAllSets();

	
	const books = getResourcesByType("book", { status: ["completed"] });

	return {
		author,
		stats: {
			articles: posts.length,
			projects: sets.length,
			booksRead: books.length
		}
	};
};
