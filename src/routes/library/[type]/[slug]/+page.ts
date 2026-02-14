
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

	
	
	const modules = import.meta.glob<ContentModule>("/src/content/library/**/*.md");

	let matchPath: string | null = null;


	
	for (const path in modules) {
		
		if (!path.includes(`/library/${folder}/`)) continue;
		
		
		if (!path.endsWith(`/${slug}.md`)) continue;

		matchPath = path;
		break; 
	}

	if (!matchPath) {
		error(404, "Resource not found");
	}

	
	const module = await modules[matchPath]();
	
	if (!module || !module.metadata) {
		error(404, "Invalid resource data");
	}
    
    
    
    
    
    
    
    const partialResource = {
        ...module.metadata,
        content: module.default,
        slug
    } as Record<string, unknown>;

    if (!partialResource.type) {
        
        if (allowedTypes.length === 1) {
             partialResource.type = allowedTypes[0];
        }
    }
    
    const resource = partialResource as unknown as Resource;
    
    
    
    if (!allowedTypes.includes(resource.type) && allowedTypes.length > 0) {
         error(404, "Resource type mismatch");
    }

	
	const relatedResources: Resource[] = [];
	const sameTypePaths = Object.keys(modules).filter(
		(path) => path.includes(`/library/${folder}/`) && path !== matchPath
	);

	
	const randomPaths = sameTypePaths.sort(() => 0.5 - Math.random()).slice(0, 4);
	
	for (const path of randomPaths) {
		const mod = await modules[path](); 
		if (mod && mod.metadata) {
			relatedResources.push({
				...mod.metadata,
				slug: path.split('/').pop()?.replace('.md', '') || '',
				
			} as unknown as Resource);
		}
	}

	return {
		resource,
		relatedResources
	};
};
