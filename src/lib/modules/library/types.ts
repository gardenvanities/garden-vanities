 





import type { BaseContent, ImageMetadata } from "$lib/shared/types";
import type { Component } from "svelte";





export type ConsumptionStatus = 
	| "queued" 
	| "consuming" 
	| "completed" 
	| "abandoned"
	| "to-read"
	| "to-watch"
	| "to-listen"
	| "to-play"
	| "in-progress";

export type ResourceType =
	| "book"
	| "noble"
	| "film"
	| "tv-series"
	| "album"
	| "track"
	| "playlist"
	| "article"
	| "paper"
	| "game"
	| "podcast"
	| "video"
	| "course"
	| "tool";

export type BookFormat = "physical" | "ebook" | "audiobook";





export type ResourceCover = ImageMetadata;





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
	
	subtitle?: string;
	author?: string | string[]; 
	publishedAt?: string; 
	url?: string; 
	metadata?: Record<string, string | number | boolean>; 
	html?: string; 
}





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





export interface ArticleResource extends ResourceBase {
	type: "article";
	author: string | string[];
	publication?: string;
	publishedAt: string;
	url: string;
	readingTime?: number;
	archived?: boolean;
}





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





export interface NobleResource extends ResourceBase {
	type: "noble";
	author: string | string[];
}

export interface GameResource extends ResourceBase {
	type: "game";
	developer?: string;
	publisher?: string;
	platform?: string[];
}

export interface PodcastResource extends ResourceBase {
	type: "podcast";
	host?: string | string[];
}

export interface VideoResource extends ResourceBase {
	type: "video";
	channel?: string;
	duration?: number;
}

export interface CourseResource extends ResourceBase {
	type: "course";
	instructor?: string | string[];
	platform?: string;
}

export interface ToolResource extends ResourceBase {
	type: "tool";
	developer?: string;
}





export type Resource =
	| BookResource
	| FilmResource
	| TVSeriesResource
	| AlbumResource
	| TrackResource
	| PlaylistResource
	| ArticleResource
	| PaperResource
	| NobleResource
	| GameResource
	| PodcastResource
	| VideoResource
	| CourseResource
	| ToolResource;





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


export const FOLDER_TO_TYPE: Record<string, ResourceType> = {
	books: "book",
	nobels: "noble",
	films: "film",
	"series-tv": "tv-series",
	music: "album",
	articles: "article",
	research: "paper",
	games: "game",
	podcasts: "podcast",
	videos: "video",
	courses: "course",
	tools: "tool"
};

export const FOLDER_TO_TYPES: Record<string, ResourceType[]> = {
	books: ["book"],
	nobels: ["noble"],
	films: ["film"],
	"series-tv": ["tv-series"],
	music: ["album", "track", "playlist"],
	articles: ["article"],
	research: ["paper"],
	games: ["game"],
	podcasts: ["podcast"],
	videos: ["video"],
	courses: ["course"],
	tools: ["tool"]
};

export const TYPE_TO_FOLDER: Record<ResourceType, string> = {
	book: "books",
	noble: "nobels",
	film: "films",
	"tv-series": "series-tv",
	album: "music",
	track: "music",
	playlist: "music",
	article: "articles",
	paper: "research",
	game: "games",
	podcast: "podcasts",
	video: "videos",
	course: "courses",
	tool: "tools"
};


export const TYPE_LABELS: Record<ResourceType, string> = {
	book: "Livro",
	noble: "Novel",
	film: "Filme",
	"tv-series": "Série",
	album: "Álbum",
	track: "Música",
	playlist: "Playlist",
	article: "Artigo",
	paper: "Pesquisa",
	game: "Jogo",
	podcast: "Podcast",
	video: "Vídeo",
	course: "Curso",
	tool: "Ferramenta"
};

export const TYPE_LABELS_PLURAL: Record<ResourceType, string> = {
	book: "Livros",
	noble: "Novels",
	film: "Filmes",
	"tv-series": "Séries",
	album: "Álbuns",
	track: "Músicas",
	playlist: "Playlists",
	article: "Artigos",
	paper: "Pesquisas",
	game: "Jogos",
	podcast: "Podcasts",
	video: "Vídeos",
	course: "Cursos",
	tool: "Ferramentas"
};

export const STATUS_LABELS: Record<ConsumptionStatus, string> = {
	queued: "Na fila",
	consuming: "Consumindo",
	completed: "Concluído",
	abandoned: "Abandonado",
	"to-read": "Para Ler",
	"to-watch": "Para Assistir",
	"to-listen": "Para Ouvir",
	"to-play": "Para Jogar",
	"in-progress": "Em Progresso"
};
