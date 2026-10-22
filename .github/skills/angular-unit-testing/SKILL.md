---
name: angular-unit-testing
description: "Write, improve, or debug Angular unit tests in StockFlow using Angular TestBed, Vitest, and JSDOM. Use for component, service, HTTP, form, permission, inventory, and invoice tests."
---

# Angular unit testing

Use this workflow when adding tests, fixing a failing unit test, or deciding what to cover for a StockFlow change.

1. Inspect the implementation, existing neighboring specs, `angular.json`, `tsconfig.spec.json`, and `package.json`. Preserve the project's Angular CLI + Vitest + JSDOM setup; do not introduce another test framework or browser provider without a requirement.
2. Identify the externally observable behavior and acceptance criteria. For business rules, access-control matrices, invoice calculations, and stock transitions, find the authoritative requirement or API contract first. Ask when those rules are not defined.
3. Choose the narrowest useful test:
   - Pure calculation or transformation: test the function directly.
   - Angular service or dependency injection: use `TestBed` when its DI behavior matters.
   - Component-template behavior: create a fixture and verify rendered content, states, and interaction through the DOM.
   - HTTP behavior: use Angular's HTTP testing utilities and flush controlled responses; do not call a live backend.
4. Keep setup explicit and typed. Use small provider stubs and Vitest `vi.fn()`/`vi.spyOn()` only at boundaries where controlling a dependency is useful. Avoid mocking the code under test.
5. Cover representative success and meaningful edge/failure cases: invalid input, empty/loading/error UI, denied permissions, or boundary values when relevant. Do not add assumptions to financial or inventory tests; totals and transitions must follow specified business rules.
6. Keep tests isolated and deterministic. Reset mocks, avoid dependence on test order, real time, sleeps, external APIs, and implementation details. Use Angular fixture stability utilities instead of arbitrary delays.
7. Run the focused spec using the repository's supported Angular CLI workflow, then run `npm test` and `npm run build` when the change warrants it. Do not use `--browsers` unless browser mode has been deliberately configured.
8. Summarize behaviors covered and commands run. Distinguish unit-test evidence from backend authorization, concurrency, integration, and legal/financial validation that the unit tests cannot establish.

Read [the unit-test instructions](../../instructions/unit-testing.instructions.md) and the official [Angular testing overview](https://angular.dev/guide/testing), [component testing guide](https://angular.dev/guide/testing/components-basics), and [service testing guide](https://angular.dev/guide/testing/services) when a specific Angular testing API is unfamiliar. Check examples against this project's installed Angular version before using them.
