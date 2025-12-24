// src/lib/utils/serie.ts
import type { Post, SerieNavigation } from '$lib/types';

export function computeSerieNavigation(
  currentPost: Post,
  allPosts: Post[]
): SerieNavigation | undefined {
  if (!currentPost.serie) return undefined;

  const seriePosts = allPosts
    .filter(
      (p) =>
        p.serie?.name === currentPost.serie?.name &&
        p.visibility === 'public'
    )
    .sort((a, b) => (a.serie?.order ?? 0) - (b.serie?.order ?? 0));

  const currentIndex = seriePosts.findIndex(
    (p) => p.slug === currentPost.slug
  );

  if (currentIndex === -1) return undefined;

  const prev = seriePosts[currentIndex - 1];
  const next = seriePosts[currentIndex + 1];

  return {
    total: seriePosts.length,
    current: currentIndex + 1,
    prev: prev ? { slug: prev.slug, title: prev.title } : undefined,
    next: next ? { slug: next.slug, title: next.title } : undefined
  };
}

export function getSeriePosts(serieName: string, allPosts: Post[]): Post[] {
  return allPosts
    .filter(
      (p) => p.serie?.name === serieName && p.visibility === 'public'
    )
    .sort((a, b) => (a.serie?.order ?? 0) - (b.serie?.order ?? 0));
}
