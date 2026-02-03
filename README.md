# Garden of Vanities

A Personal Digital Garden built with SvelteKit, designed for curation and contemplation.

## Architecture

This project follows a **Domain-Driven Modular Architecture**:

- **`src/lib/modules`**: Encapsulates business logic by domain (e.g., `posts`, `library`, `garden`, `series`). Each module contains its own components, types, and utilities.
- **`src/lib/ui`**: Contains generic, reusable "atomic" components (Design System) that are domain-agnostic.
- **`src/lib/server`**: Centralized data fetching and processing logic, acting as an internal API layer.
- **`src/routes`**: Minimal SvelteKit routing layer, primarily orchestrating data from `lib/server` to components in `lib/modules`.

## Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Run tests
bun test

# Checking code quality
bun check
```

## Structure

```
src/
├── content/        # Markdown source files (database)
├── lib/
│   ├── modules/    # Domain logic (Business Layer)
│   ├── ui/         # Generic UI components (Presentation Layer)
│   ├── server/     # Data loaders (Service Layer)
│   └── core/       # Core configurations (Theme, SEO)
└── routes/         # Application Routes (Controller Layer)
```
