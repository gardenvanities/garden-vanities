import type { Resource } from "./types";

 
export function getCreatorName(resource: Resource): string | null {
	if ("author" in resource && resource.author) {
		return Array.isArray(resource.author) ? resource.author[0] : resource.author;
	}
	if ("director" in resource && resource.director) {
		return Array.isArray(resource.director) ? resource.director[0] : resource.director;
	}
	if ("artist" in resource && resource.artist) {
		return Array.isArray(resource.artist) ? resource.artist[0] : resource.artist;
	}
	if ("creator" in resource && resource.creator) {
		return Array.isArray(resource.creator) ? resource.creator[0] : resource.creator;
	}
	if ("authors" in resource && resource.authors) {
		return resource.authors[0] + (resource.authors.length > 1 ? " et al." : "");
	}
	return null;
}
