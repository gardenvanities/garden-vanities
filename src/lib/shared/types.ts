 

export interface ImageMetadata {
	url: string;
	alt: string;
	caption?: string;
	aspectRatio?: string;
	focalPoint?: { x: number; y: number };
}

export interface BaseContent {
	slug: string;
	title: string;
	subtitle?: string;
	summary?: string;
	tags?: string[];
	cover?: ImageMetadata;
	updatedAt?: string;
	publishedAt?: string;
	createdAt?: string;
}
