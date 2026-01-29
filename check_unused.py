import os
import glob
import re

def get_svelte_components():
    return glob.glob('src/lib/**/*.svelte', recursive=True)

def check_usage(component_path):
    component_name = os.path.basename(component_path).replace('.svelte', '')
    search_patterns = [
        f"<{component_name}",  # Usage in template
        f"import {component_name}", # Default import or named import start
        f"import {{ {component_name}", # Named import
        f"import.*{component_name}.*from", # Import
        f": {component_name}", # Type usage or aliasing
        f"new {component_name}" # Instantiation
    ]
    
    # We need to find if ANY file in src (except the component itself) contains ANY of these patterns
    found = False
    
    # Walk through all files in src
    for root, dirs, files in os.walk('src'):
        for file in files:
            if not (file.endswith('.svelte') or file.endswith('.ts') or file.endswith('.js')):
                continue
                
            file_path = os.path.join(root, file)
            
            # Skip checking the file against itself
            if os.path.abspath(file_path) == os.path.abspath(component_path):
                continue

            # Skip checking index.ts files that just export equality
            # logic: if an index.ts file only exports the component, it doesn't count as "usage" in the app sense, 
            # unless that index.ts is imported elsewhere. 
            # But simpler logic first: just check content.
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Basic check for component name to save regex time
                    if component_name not in content:
                        continue

                    # If the file is an index.ts that just exports it, we might want to verify if *that* export is used.
                    # But for now, let's just see raw presence.
                    for pattern in search_patterns:
                        if re.search(pattern, content):
                            return True
            except Exception as e:
                pass # ignore read errors
                
    return False

components = get_svelte_components()
unused = []

print("Checking components...")
for comp in components:
    if not check_usage(comp):
        unused.append(comp)

if unused:
    print("\nPotentially unused components:")
    for comp in unused:
        print(comp)
else:
    print("\nNo unused components found.")
