import { getAllPosts } from "$lib/server/posts";
import type { RequestHandler } from "./$types";

const SITE_URL = "https://gardenofvanities.vercel.app";

function absoluteUrl(path: string) {
	const base = SITE_URL.replace(/\/+$/, "");
	if (!path || path === "/") return base;
	return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function escapeXml(str: string) {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function formatDateToYMD(date: Date) {
	return date.toISOString().split("T")[0];
}

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts({ ripeness: ["fruit"] });

	const pages = [
		{ url: "/", priority: 1.0, changefreq: "daily" },
		{ url: "/explore", priority: 0.9, changefreq: "daily" },
		{ url: "/sets", priority: 0.8, changefreq: "weekly" },
		{ url: "/series", priority: 0.8, changefreq: "weekly" }
	];

	const urls = [
		...pages.map((page) => {
			const loc = escapeXml(absoluteUrl(page.url));
			const priority = Number(page.priority).toFixed(1);

			return `<url><loc>${loc}</loc><changefreq>${page.changefreq}</changefreq><priority>${priority}</priority></url>`;
		}),
		...posts.map((post) => {
			const loc = escapeXml(absoluteUrl(`/posts/${post.slug}`));
			const lastmodDate = post.updatedAt
				? new Date(post.updatedAt)
				: post.publishedAt
					? new Date(post.publishedAt)
					: new Date();
			const lastmod = formatDateToYMD(lastmodDate);
			const priority = (0.6).toFixed(1);
			return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`;
		})
	].join("");

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`.trim();

	return new Response(sitemap, {
		headers: {
			"Content-Type": "application/xml",
			"Cache-Control": "max-age=0, s-maxage=3600"
		}
	});
};
