---
description: 'Use when creating or editing Angular components, directives, services, routes, templates, styles, or tests in StockFlow. Applies Angular 21 conventions.'
applyTo:
  - 'src/**/*.ts'
  - 'src/**/*.html'
  - 'src/**/*.scss'
---

# Angular 21 implementation rules

- Match the installed Angular 21 APIs; do not use Angular 22-only recommendations such as Signal Forms or the `@Service` decorator unless the project is upgraded and the APIs are available.
- In SCSS, sort every declaration block's properties alphabetically by property name. Keep each declaration's multiline value intact, and check shorthand/longhand interactions so sorting does not change the cascade.
- Use standalone components (the default); do not set `standalone: true`. Set `changeDetection: ChangeDetectionStrategy.OnPush` on components.
- Use signals for local state, `computed()` for derived state, and pure updates with `set()` or `update()`. Do not use `mutate()`.
- Keep component/form state local; for shared/feature state, follow [NgRx instructions](./ngrx.instructions.md) and load the `ngrx-state-management` skill before choosing SignalStore or classic Store.
- Prefer `input()` and `output()` over decorator-based inputs and outputs. Use `inject()` rather than constructor injection.
- Keep components focused. Use inline templates only when small; otherwise use external template and style paths relative to the component TypeScript file.
- Put services used only by one page in that page's `services/` subfolder (for example, `src/app/pages/users/services/`). Keep genuinely shared services, domain contracts, and adapters under `src/app/core/`; avoid adding a services folder that merely re-exports shared core services.
- Add a concise Polish JSDoc comment above every feature component class. Describe its user-facing purpose, workflow/actions, outputs or side effects, and relevant validation/permission constraints from confirmed requirements so the comment can later inform client documentation. Keep it accurate as the feature changes; do not add boilerplate comments to implementation details or invent undocumented business rules.
- Lazy-load feature routes. Use native template control flow (`@if`, `@for`, `@switch`) and direct imports of the directives and pipes a template uses; avoid `CommonModule`, `*ngIf`, and `*ngFor`.
- Prefer Reactive Forms for forms in this Angular version. Validate input at the UI boundary and keep authoritative business validation on the backend.
- Use `[class]` and individual class bindings rather than `ngClass`, and style bindings rather than `ngStyle`.
- Use `NgOptimizedImage` for static image assets; it does not support inline base64 images.
- Put host bindings/listeners in the directive or component `host` metadata, not `@HostBinding` or `@HostListener`.
- Keep templates simple, avoid assuming browser globals such as `new Date()` are available in templates, and expose derived values from TypeScript.
- Make controls keyboard-accessible and provide labels, visible focus, suitable status announcements, and semantic HTML. Do not use color alone to convey status.
- In popups and modal dialogs, align action buttons to the right by default; override only when a confirmed design requirement calls for a different alignment.
- Follow the existing test framework and patterns. Test user-visible behavior and meaningful boundary cases, not implementation details.
