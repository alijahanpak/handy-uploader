# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Handy Uploader is a Vue 3 file uploader component library with Vuetify 3. It provides three uploader layouts (simple, thumbnail, table), automatic video thumbnail generation, image compression, and i18n support for 8 languages.

## Commands

```bash
# Development
npm run dev           # Vite dev server
npm run storybook     # Storybook at localhost:6006

# Build
npm run build         # Full build (type-check + build-lib + build-types)
npm run build-lib     # Build library only
npm run build-types   # Generate TypeScript declarations

# Code Quality
npm run lint          # ESLint with auto-fix
npm run format        # Prettier formatting
npm run type-check    # Vue type checking
```

## Architecture

### Component Structure

The library exposes one main component (`HandyUploader`) that switches between three uploader implementations based on the `type` prop:
- `ThumbnailUploader` - Grid-based card layout with visual previews
- `TableUploader` - Sortable table layout
- `SimpleUploader` - Minimal drag-and-drop interface

### Key Directories

- `src/components/` - Vue 3 SFCs for all uploader variants
- `src/composables/` - `useFileUpload` (core upload logic) and `useErrorHandler` (notification system)
- `src/utils/fileUtils.ts` - File utilities (icons, type detection, compression, base64 conversion)
- `src/types/index.ts` - All TypeScript interfaces and types
- `src/lib/` - Library entry point, i18n, and documentation
- `src/stories/` - Storybook stories

### Build Output

Library builds to dual format (ESM + UMD) in `dist/`. Vue and Vuetify are external peer dependencies (not bundled).

## Code Conventions

- **TypeScript** throughout with strict typing
- **Vue 3 Composition API** using `<script setup lang="ts">`
- **Path alias**: `@/` maps to `./src/`
- **Formatting**: No semicolons, single quotes, 2-space indent, 100 char lines

## Types

Core types in `src/types/index.ts`:
- `FileData` - File metadata including base64, thumbnail, and upload state
- `FileUploaderType` - Union type for layout selection
- `BaseUploaderProps` / `HandyUploaderProps` - Component prop interfaces
