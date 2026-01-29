import { mdsvex, escapeSvelte } from "mdsvex";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
// import remarkFootnotes from "remark-footnotes";

import { remarkCloudinaryImages } from "./src/lib/server/remark-cloudinary-images.ts";
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { createHighlighter } from "shiki";

const theme = "poimandres";
const highlighter = await createHighlighter({
	themes: [theme],
	langs: ["javascript", "typescript", "css", "svelte", "markdown", "bash"]
});

const config = {
	extensions: [".svelte", ".md", ".svx"],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: [".md", ".svx"],
			remarkPlugins: [
				remarkGfm,
				// remarkFootnotes,
				remarkMath,
				remarkCloudinaryImages(process.env.PUBLIC_CLOUDINARY_CLOUD_NAME || "")
			],
			rehypePlugins: [rehypeSlug /*, rehypeKatexSvelte */],
			highlight: {
				highlighter: async (code, lang) => {
					await highlighter.loadLanguage(lang);
					const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme }));
					return `{@html \`${html}\` }`;
				}
			}
		})
	],

	kit: {
		adapter: adapter(),
		alias: {
			"@/*": "./src/lib/*"
		}
	}
};

export default config;
