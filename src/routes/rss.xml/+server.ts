import { getAllPosts } from "$lib/server/posts";
import type { PostFrontmatter } from "$lib/types";

const SITE_URL = "https://gardenofvanities.vercel.app";
const SITE_TITLE = "Garden of Vanities";
const SITE_DESCRIPTION =
	"Um jardim digital de ideias, ensaios e notas sobre tecnologia e filosofia."; // Customize as needed

export const GET = async () => {
	const posts = await getAllPosts({ ripeness: ["fruit", "root"] });

	const body = renderXml(posts);
	const headers = {
		"Content-Type": "application/xml",
		"Cache-Control": "max-age=0, s-maxage=3600"
	};

	return new Response(body, { headers });
};

const renderXml = (posts: PostFrontmatter[]) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <description>${SITE_DESCRIPTION}</description>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts
			.map(
				(post) => `
    <item>
      <title>${post.title}</title>
      <description>${post.summary || ""}</description>
      <link>${SITE_URL}/posts/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt || post.updatedAt || new Date()).toUTCString()}</pubDate>
    </item>
    `
			)
			.join("")}
  </channel>
</rss>
`;
