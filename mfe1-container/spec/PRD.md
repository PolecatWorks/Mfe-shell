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

## Technical Details
- **Framework:** Angular 21
- **Styling:** SCSS / Tailwind (optional)
- **Federation:** @angular-architects/native-federation
- **Port:** 3000

## Testing
- **Runner:** ng test (Karma)
- **Location:** `src/app/**/*.spec.ts`
