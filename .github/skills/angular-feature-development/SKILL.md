---
name: angular-feature-development
description: 'Implement or refactor Angular 21 features in StockFlow. Use for routes, components, services, forms, state, API integration, accessibility, and tests.'
---

# Angular feature development

Use this workflow for an ERP/web feature or a substantial Angular refactor. The Angular renderer is shared by web and Electron desktop, with mobile packaging planned for later.

1. Inspect the existing routes, feature structure, API contracts, styles, test setup, and the relevant source files before choosing an implementation.
2. Check the installed Angular and TypeScript versions in `package.json`. Use the Angular CLI MCP server from `.vscode/mcp.json` when available, and verify unfamiliar or version-sensitive APIs against the official Angular documentation. Do not apply APIs that require a newer Angular version.
3. Identify user-visible states, permissions, validation, loading and error behavior, keyboard interaction, responsive behavior, and acceptance criteria. Ask for unresolved business decisions instead of inventing them.
4. Implement the smallest cohesive feature using the conventions in [the Angular instruction file](../../instructions/angular.instructions.md). Lazy-load feature routes and keep UI, state, and API responsibilities separated according to existing project patterns. Keep renderer features portable across web and Electron; don't add direct Node/Electron APIs to Angular components.
   - Place services used only by one page in that page's `services/` subfolder. Keep cross-page services, domain contracts, and replaceable adapters in `src/app/core/`.
5. When editing SCSS, sort declaration properties alphabetically within each rule. Preserve multiline values and verify shorthand/longhand cascade behavior after sorting.
6. Preserve the configured hash-based routing so packaged Electron file URLs resolve correctly. Keep shared feature logic independent of platform-specific APIs.
7. Add a concise Polish JSDoc comment to every feature component class, explaining its user-facing purpose and real workflow, actions, side effects, and verified constraints. Write it so it can later be adapted into client documentation; do not describe internal implementation or guess rules.
8. Add or update tests for the behavior, including meaningful validation, failure, and permission cases. Use the repository's configured test runner rather than adding a new one.
9. Run the focused tests and `npm run build`. For Electron-dependent changes, also run `npm run electron:build:web` and follow [the Electron desktop skill](../electron-desktop/SKILL.md). Report exact checks and remaining assumptions.
10. There is no backend yet. Before adding mock API/data behavior, read [the temporary mock-backend skill](../temporary-mock-backend/SKILL.md) and keep the mock isolated from feature components.
11. Keep simple state local. Before introducing shared NgRx state, read [the NgRx state-management skill](../ngrx-state-management/SKILL.md) and choose SignalStore or classic Store based on concrete requirements.
