# StockFlow project guidelines

## Project context

StockFlow is a planned, extensible ERP system. Its initial delivery is an Angular 21 web/desktop application using Electron; mobile packaging may be added later. There is no backend yet. The planned backend is C#/.NET with PostgreSQL; until it is explicitly started, use isolated frontend mock adapters only and load the `temporary-mock-backend` skill for mock data/API work. Treat ERP modules (inventory, roles, invoices, and others) as planned until implemented: inspect the current code before describing or extending behavior. The project uses TypeScript, SCSS, and Vitest through the Angular CLI.
The current application release is `0.0.1`. Keep `package.json`, `package-lock.json`, Electron package metadata, the browser tab title, and the visible app version aligned when changing it.

## Engineering standards

- Keep TypeScript strict and type-safe. Prefer inference when clear; avoid `any`.
- Follow the Angular-specific rules in [angular.instructions.md](./instructions/angular.instructions.md) when editing application code.
- In SCSS, sort every declaration block's properties alphabetically by property name. Keep each declaration's multiline value intact, and check shorthand/longhand interactions so sorting does not change the cascade.
- Keep feature code cohesive and accessible; meet WCAG 2.2 AA and verify keyboard interaction, focus behavior, labels, and contrast.
- Prefer small, focused components and single-responsibility services. Handle loading, empty, success, and error states explicitly.
- For application state, keep isolated component/form state local with Angular signals or Reactive Forms; use NgRx SignalStore only for cohesive shared/feature state. Read [ngrx.instructions.md](./instructions/ngrx.instructions.md) and load the `ngrx-state-management` skill for NgRx changes. Avoid introducing global Store/Effects without a concrete app requirement.
- When it helps learning, briefly explain in Polish the DDD boundaries or patterns being used and why state stays local in Angular signals or moves into NgRx; keep explanations occasional and grounded in the inspected code.
- Add a concise Polish JSDoc summary to every user-facing feature component, describing its purpose and actual workflow for future client documentation. Document only verified behavior and maintain the summary when behavior changes; avoid comments on obvious code.
- Keep the Angular renderer portable across web and Electron. Keep desktop-only capabilities in the Electron main process and expose them through a narrowly scoped preload API only when a concrete need exists.
- Keep route navigation compatible with the configured hash location. Use responsive layouts for desktop and narrow screens; do not assume a desktop-only viewport.
- Mobile packaging is future scope. Do not add Capacitor or native plugins until a mobile feature requires them; share API contracts and business logic while adapting UX to device capabilities.
- Use the Angular CLI MCP server configured in `.vscode/mcp.json` when available. For Angular APIs, verify advice against the installed Angular 21 version and the official [Angular best practices](https://angular.dev/assets/context/best-practices.md), [LLM index](https://angular.dev/llms.txt), and [full LLM reference](https://angular.dev/assets/context/llms-full.txt).

## StockFlow domain

- Treat authorization as a security boundary: enforce permissions in the trusted backend/API as well as in the UI. Route guards and hidden controls improve navigation but do not secure data.
- Use least privilege. Do not invent role names, permission mappings, approval rules, or role assignments; ask for requirements when they are not defined.
- Keep the extensible role/permission catalog in `src/app/core/access-control/role-permissions.ts`. Its current role permission lists are intentionally empty until the user approves a least-privilege matrix; never invent grants or treat frontend checks as security.
- Record inventory changes as auditable stock movements rather than silently replacing quantity values. Respect the existing backend's transaction and concurrency guarantees; do not claim atomicity unless implemented and verified.
- Treat issued invoices as auditable financial records. Do not silently rewrite issued data; use the application's explicitly defined correction process.
- Do not assume invoice numbering, tax/VAT rules, currency, rounding, payment states, or legal requirements. Confirm them before implementing financial behavior.
- Avoid floating-point arithmetic for monetary values. Follow the backend/API's exact decimal or minor-unit representation and keep the UI consistent with it.
- Keep sensitive invoice, customer, and user data out of logs, URLs, and unnecessary client-side storage.

## Verification

- Run `npm run build` after application changes.
- Run the relevant unit tests with `npm test`; add or update tests for changed behavior, permissions, and financial or inventory edge cases.
- Report commands that could not run and their concrete cause. Do not present a successful build as proof that untested business rules are correct.
