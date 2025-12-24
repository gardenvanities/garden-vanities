// src/lib/utils/authors.ts
import authorsData from '$lib/data/authors.json';
import type { Author } from '$lib/types';

export function getAuthorByNick(nick: string): Author | undefined {
  const cleanNick = nick.startsWith('@') ? nick.slice(1) : nick;
  return authorsData.find((author) => author.nick === cleanNick);
}

export function getAllAuthors(): Author[] {
  return authorsData;
}
