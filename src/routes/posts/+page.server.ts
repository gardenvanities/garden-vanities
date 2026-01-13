import { getAllPosts } from "$lib/server/posts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, setHeaders }) => {
	setHeaders({
		"cache-control": "max-age=3600, s-maxage=86400"
	});

	const page = Number(url.searchParams.get("page")) || 1;
	const pageSize = Number(url.searchParams.get("limit")) || 10;

	const allPosts = await getAllPosts({
		ripeness: ["fruit"]
	});

	const totalPosts = allPosts.length;
	const totalPages = Math.ceil(totalPosts / pageSize);

	const posts = allPosts.slice((page - 1) * pageSize, page * pageSize);

	return {
		posts,
		currentPage: page,
		pageSize,
		totalPages
	};
};
