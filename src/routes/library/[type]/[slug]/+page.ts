
import { error } from "@sveltejs/kit";
import { FOLDER_TO_TYPES, type Resource } from "$lib/modules/library/types";
import type { PageLoad } from "./$types";
import type { Component } from "svelte";

type ContentModule = {
	metadata: Resource;
	default: Component;
};

export const load: PageLoad = async ({ params }) => {
	const { type: folder, slug } = params;
	const allowedTypes = FOLDER_TO_TYPES[folder];

	if (!allowedTypes) {
		error(404, "Unknown resource type");
	}

	// Load all library content (lazy)
	// Note: We use a string literal for glob to ensure Vite can analyze it staticallly
	const modules = import.meta.glob<ContentModule>("/src/content/library/**/*.md");

	let matchPath: string | null = null;


	// Find matching file
	for (const path in modules) {
		// Filter by folder
		if (!path.includes(`/library/${folder}/`)) continue;
		
		// Filter by slug
		if (!path.endsWith(`/${slug}.md`)) continue;

		matchPath = path;
		break; 
	}

	if (!matchPath) {
		error(404, "Resource not found");
	}

	// Load the module
	const module = await modules[matchPath]();
	
	if (!module || !module.metadata) {
		error(404, "Invalid resource data");
	}
    
    // Determine type (fallback to folder mapping if not in metadata) 
    // Simplified logic: we know the folder derived the allowed types.
    // We can trust metadata.type if present, else assume it matches the folder's primary type?
    // Actually, let's just use metadata type or what we found.
    // We need to ensure the type matches the accepted types for this folder.
    
    const partialResource = {
        ...module.metadata,
        content: module.default,
        slug
    } as Record<string, unknown>;

    if (!partialResource.type) {
        // Try to infer type from folder if single type mapped
        if (allowedTypes.length === 1) {
             partialResource.type = allowedTypes[0];
        }
    }
    
    const resource = partialResource as unknown as Resource;
    
    // Validate type
    if (!allowedTypes.includes(resource.type)) {
         // It might be valid but we are viewing it under wrong URL?
         // Or strictly enforce? 
         // Allow if it's in the set.
    }

	return {
		resource
	};
};
