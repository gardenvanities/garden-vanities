import { AUTHORS_DATA as authorsData } from "./data";
import type { Author } from "./types";

export function getAuthorByNick(nick: string): Author | undefined {
	const cleanNick = nick.startsWith("@") ? nick.slice(1) : nick;
	return authorsData.find((author) => author.nick === cleanNick);
}

export function getAllAuthors(): Author[] {
	return authorsData;
}
