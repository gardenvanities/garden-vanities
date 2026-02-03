/**
 * Shared Type Definitions
 * Centralized common types used across different modules
 */

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
}
