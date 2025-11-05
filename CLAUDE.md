# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 4-based CMS template with Directus integration. The project uses TypeScript, Tailwind CSS v4, GSAP 3.13.0 (the completely free version!), and Shadcn Vue components for building CMS-powered web applications.

## Development Commands

```bash
# Install dependencies (using pnpm)
pnpm install

# Run development server
pnpm run dev

# Build for production
pnpm run build

# Run production build locally
pnpm run preview

# Type checking
pnpm run typecheck

# Linting
pnpm run lint

# Format code
pnpm run format

# Generate Directus TypeScript types
pnpm run generate:types
```

## Architecture Overview

### Core Stack
- **Framework**: Nuxt 3 with file-based routing
- **CMS**: Directus integration for content management
- **Styling**: Tailwind CSS with Shadcn Vue components
- **Type Safety**: TypeScript with generated Directus types
- **Package Manager**: pnpm (version 8.6.0+)

### Key Directories

- `app/` - Main application code
  - `components/` - Vue components organized by type:
    - `block/` - CMS-driven content blocks (Hero, Gallery, etc.)
    - `forms/` - Form components and field inputs
    - `ui/` - Shadcn UI components
  - `pages/` - File-based routing with dynamic routes
    - `[...permalink].vue` - Catch-all route for CMS pages
    - `blog/[slug].vue` - Dynamic blog post routes
  - `composables/` - Vue composables for live preview and visual editing

- `server/` - Nitro server utilities and API routes
  - `api/` - API endpoints for Directus data fetching
  - `utils/` - Server-side Directus utilities

- `shared/` - Shared types and utilities
  - `types/schema.ts` - Generated Directus schema types

### Environment Configuration

Required environment variables:
- `NUXT_PUBLIC_SITE_URL` - Public site URL for SEO
- `NUXT_PUBLIC_ENABLE_VISUAL_EDITING` - Enable/disable visual editing

### Key Features

1. **Dynamic Page Builder**: PageBuilder component assembles CMS blocks dynamically
2. **Live Preview**: Built-in draft/preview mode with `?preview=true` parameter
3. **Admin Bar**: Visual editing interface for authenticated users
4. **Form System**: Dynamic form builder with Zod validation
5. **Search**: Integrated search functionality via `/api/search`
6. **Sitemap**: Auto-generated sitemap from CMS content

### Directus Integration

The project uses `@directus/sdk` for API communication. Key patterns:
- Server-side data fetching in API routes
- Type generation from Directus schema
- Draft/preview mode support
- Visual editing capabilities

### Component Patterns

- UI components use Radix Vue primitives via Shadcn
- Form components integrate with vee-validate and Zod
- Block components map to Directus collection items
- All components use TypeScript with proper type definitions

## Frontend Animation & Graphics Notes

- **GSAP availability**: A Nuxt client plugin (`app/plugins/gsap.client.ts`) injects `$gsap`. Never import GSAP directly at the top of a component—call `const gsap = useNuxtApp().$gsap` inside a client guard.
- **Logo animation**: `SiteLogoAnimated.client.vue` expects `$gsap` and already wires the reference demo logic. When adjusting it:
  - Keep masks filled with black; only swap visible shapes via `currentColor`.
  - The component relies on `mix-blend-mode: difference` plus `text-stone-200` to auto-contrast against the image slider background.
  - Query the DOM only after `process.client` checks; the script already handles DOMContentLoaded for safety.
