# MFE1 Product Requirements Document (PRD)

## Overview
MFE1 is an Angular-based Micro Frontend that provides data visualization components. It is integrated into the MFE Shell via Native Federation.

## Features

### 1. JSON Show
- **Selector:** `app-json-show`
- **Purpose:** Displays JSON data in a formatted way.
- **Inputs:** `data: any`

### 2. Mermaid Show
- **Selector:** `app-mermaid-show`
- **Purpose:** Renders Mermaid diagrams from a text string.
- **Inputs:** `content: string`
- **Implementation:** Uses `mermaid.js` for rendering. Supports dark theme by default.
- **Wrapper:** `MermaidShowWrapper` allows mounting in non-Angular environments.

### 3. Data Show
- **Selector:** `app-data-show`
- **Purpose:** Renders a D3-based line graph with multiple datasets.
- **Inputs:**
  - `title: string`: Chart title.
  - `datasets: Dataset[]`: Array of dataset objects.
  - `xType: 'time' | 'linear' | 'band'`: Type of X axis scale.
- **Implementation:** Uses `D3.js` for SVG-based visualization. Supports animations and tooltips.
- **Wrapper:** `DataShowWrapper` allows mounting in non-Angular environments.

### 4. Markdown Show
- **Selector:** `app-markdown-show`
- **Purpose:** Renders markdown text as pretty HTML.
- **Inputs:** `content: string`
- **Implementation:** Uses `marked` library for parsing. Supports GFM and automatic line breaks. Dark-mode first design with glassmorphism.
- **Wrapper:** `MarkdownShowWrapper` allows mounting in non-Angular environments.

### 5. Personal Data Form & Bidirectional Shared Canvas (`MfeCanvasController`)
- **Selector:** `app-personal-data-form` (`PersonalDataFormWrapper`)
- **Purpose:** Interactive reactive form for viewing and editing structured customer/entity fields (`firstName`, `lastName`, `email`, `phoneNumber`, `address`), supporting live human + AI co-editing on the RHS of `Angry-agent`.
- **Bidirectional Canvas Contract:** All `mfe1` wrappers implement the `MfeCanvasController` interface (`applyPatch`, `getState`, `getSchema`, `unmount`) defined in [`../../spec/prds/shared-canvas-protocol-and-ecosystem-prd.md`](../../spec/prds/shared-canvas-protocol-and-ecosystem-prd.md), enabling in-place RFC 6902 JSON Patch updates without unmounting the DOM or losing user focus.

## Technical Details
- **Framework:** Angular 21
- **Styling:** SCSS / Tailwind (optional)
- **Federation:** @angular-architects/native-federation
- **Port:** 3000

## Testing
- **Runner:** ng test (Karma)
- **Location:** `src/app/**/*.spec.ts`

