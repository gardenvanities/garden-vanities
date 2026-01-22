import { getAllPosts } from "$lib/server/posts";
import { getAllSets } from "$lib/server/collections";
import { getResourcesByType } from "$lib/server/library";
import { getAllAuthors } from "$lib/modules/author";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
	const authors = getAllAuthors();
	const author = authors[0]; // Get the primary author

	if (!author) {
		throw error(404, "Author not found");
	}

	// Fetch content stats
	const posts = await getAllPosts();
	const sets = getAllSets();
    
    // Fetch library stats for "books read"
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
