/**
 * Library Module Types
 *
 * Types for managing consumed content references (books, films, music, etc.)
 */

// ─────────────────────────────────────────────────────────────────────────────
// Enums and Base Types
// ─────────────────────────────────────────────────────────────────────────────

import type { BaseContent, ImageMetadata } from "$lib/shared/types";
import type { Component } from "svelte";

// ─────────────────────────────────────────────────────────────────────────────
// Enums and Base Types
// ─────────────────────────────────────────────────────────────────────────────

export type ConsumptionStatus = "queued" | "consuming" | "completed" | "abandoned";

export type ResourceType =
	| "book"
	| "film"
	| "tv-series"
	| "album"
	| "track"
	| "playlist"
	| "article"
	| "paper";

export type BookFormat = "physical" | "ebook" | "audiobook";

// ─────────────────────────────────────────────────────────────────────────────
// Cover Image
// ─────────────────────────────────────────────────────────────────────────────

export type ResourceCover = ImageMetadata;

// ─────────────────────────────────────────────────────────────────────────────
// Base Resource Interface
// ─────────────────────────────────────────────────────────────────────────────

export interface ResourceBase extends BaseContent {
	type: ResourceType;
	status: ConsumptionStatus;
	rating?: number;
	startedAt?: string;
	completedAt?: string;
	affiliateLink?: string;
	externalLink?: string;
	personalNotes?: string;
	createdAt: string;
	content?: Component;
}

// ─────────────────────────────────────────────────────────────────────────────
// Book Resource
// ─────────────────────────────────────────────────────────────────────────────

export interface BookResource extends ResourceBase {
	type: "book";
	author: string | string[];
	publisher?: string;
	edition?: string;
	isbn?: string;
	year?: number;
	pages?: number;
	originalTitle?: string;
	translator?: string;
	language: string;
	genres?: string[];
	format: BookFormat;
}

// ─────────────────────────────────────────────────────────────────────────────
// Film Resource
// ─────────────────────────────────────────────────────────────────────────────

export interface FilmResource extends ResourceBase {
	type: "film";
	director: string | string[];
	year: number;
	runtime?: number;
	genres?: string[];
	country?: string;
	imdbId?: string;
	tmdbId?: string;
	watchedAt?: string;
	whereWatched?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// TV Series Resource
// ─────────────────────────────────────────────────────────────────────────────

export interface TVSeriesResource extends ResourceBase {
	type: "tv-series";
	creator: string | string[];
	yearStart: number;
	yearEnd?: number;
	seasons?: number;
	episodes?: number;
	genres?: string[];
	network?: string;
	currentSeason?: number;
	currentEpisode?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Music Resources
// ─────────────────────────────────────────────────────────────────────────────

export interface AlbumResource extends ResourceBase {
	type: "album";
	artist: string | string[];
	year?: number;
	genres?: string[];
	label?: string;
	duration?: number;
	tracks?: number;
	spotifyId?: string;
	appleMusicId?: string;
}

export interface TrackResource extends ResourceBase {
	type: "track";
	artist: string | string[];
	album?: string;
	year?: number;
	genres?: string[];
	duration?: number;
	spotifyId?: string;
	appleMusicId?: string;
}

export interface PlaylistResource extends ResourceBase {
	type: "playlist";
	curator?: string;
	trackCount?: number;
	duration?: number;
	spotifyId?: string;
	appleMusicId?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Article Resource
// ─────────────────────────────────────────────────────────────────────────────

export interface ArticleResource extends ResourceBase {
	type: "article";
	author: string | string[];
	publication?: string;
	publishedAt: string;
	url: string;
	readingTime?: number;
	archived?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Research Paper Resource
// ─────────────────────────────────────────────────────────────────────────────

export interface PaperResource extends ResourceBase {
	type: "paper";
	authors: string[];
	journal?: string;
	year: number;
	doi?: string;
	pubmedId?: string;
	arxivId?: string;
	institution?: string[];
	peerReviewed?: boolean;
	citations?: number;
	url?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Union Type for All Resources
// ─────────────────────────────────────────────────────────────────────────────

export type Resource =
	| BookResource
	| FilmResource
	| TVSeriesResource
	| AlbumResource
	| TrackResource
	| PlaylistResource
	| ArticleResource
	| PaperResource;

// ─────────────────────────────────────────────────────────────────────────────
// Utility Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ResourceStats {
	total: number;
	byType: Record<ResourceType, number>;
	byStatus: Record<ConsumptionStatus, number>;
	completed: number;
	inProgress: number;
	queued: number;
}

export interface ResourceFilter {
	type?: ResourceType[];
	status?: ConsumptionStatus[];
	rating?: number;
	tags?: string[];
	search?: string;
}

// Type mapping for folder names to resource types
export const FOLDER_TO_TYPE: Record<string, ResourceType> = {
	books: "book",
	films: "film",
	"series-tv": "tv-series",
	music: "album",
	articles: "article",
	research: "paper"
};

export const FOLDER_TO_TYPES: Record<string, ResourceType[]> = {
	books: ["book"],
	films: ["film"],
	"series-tv": ["tv-series"],
	music: ["album", "track", "playlist"],
	articles: ["article"],
	research: ["paper"]
};

export const TYPE_TO_FOLDER: Record<ResourceType, string> = {
	book: "books",
	film: "films",
	"tv-series": "series-tv",
	album: "music",
	track: "music",
	playlist: "music",
	article: "articles",
	paper: "research"
};

// Labels for display
export const TYPE_LABELS: Record<ResourceType, string> = {
	book: "Livro",
	film: "Filme",
	"tv-series": "Série",
	album: "Álbum",
	track: "Música",
	playlist: "Playlist",
	article: "Artigo",
	paper: "Pesquisa"
};

export const TYPE_LABELS_PLURAL: Record<ResourceType, string> = {
	book: "Livros",
	film: "Filmes",
	"tv-series": "Séries",
	album: "Álbuns",
	track: "Músicas",
	playlist: "Playlists",
	article: "Artigos",
	paper: "Pesquisas"
};

export const STATUS_LABELS: Record<ConsumptionStatus, string> = {
	queued: "Na fila",
	consuming: "Consumindo",
	completed: "Concluído",
	abandoned: "Abandonado"
};
