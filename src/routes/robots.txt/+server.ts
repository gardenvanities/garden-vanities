import type { RequestHandler } from "./$types";

const SITE_URL = "https://gardenofvanities.vercel.app";

export const GET: RequestHandler = async () => {
	const robots = ["User-agent: *", "Disallow:", "", `Sitemap: ${SITE_URL}/sitemap.xml`].join("\n");

	return new Response(robots, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "max-age=0, s-maxage=3600"
		}
	});
};
