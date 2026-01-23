import type { Author } from "./types";

type AuthorModule = {
	metadata: Omit<Author, "bio">;
	default: unknown;
};

const modules = import.meta.glob<AuthorModule>("/src/content/authors/*.md", {
	eager: true
});

const rawModules = import.meta.glob("/src/content/authors/*.md", {
	query: "?raw",
	eager: true,
	import: "default"
});

function stripFrontmatter(content: string): string {
	return content.replace(/---\n[\s\S]*?\n---/, "").trim();
}

const authorsData: Author[] = Object.entries(modules).map(([path, module]) => {
	const raw = rawModules[path] as string;
	const bio = stripFrontmatter(raw);

	return {
		...module.metadata,
		bio: bio || undefined
	} as Author;
});

export function getAuthorByNick(nick: string): Author | undefined {
	const cleanNick = nick.startsWith("@") ? nick.slice(1) : nick;
	return authorsData.find((author) => author.nick === cleanNick);
}

export function getAllAuthors(): Author[] {
	return authorsData;
}
