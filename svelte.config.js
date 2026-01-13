import { mdsvex, escapeSvelte } from "mdsvex";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import rehypeKatexSvelte from "rehype-katex-svelte";
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { createHighlighter } from "shiki";

const theme = "dark-plus";
const highlighter = await createHighlighter({
	themes: [theme],
	langs: ["javascript", "typescript", "css", "svelte", "markdown", "bash"]
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: [".svelte", ".md", ".svx"],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: [".md", ".svx"],
			remarkPlugins: [remarkMath],
			rehypePlugins: [rehypeSlug, rehypeKatexSvelte],
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
