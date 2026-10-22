---
description: 'Use when writing or changing Angular unit tests, Vitest specs, TestBed setup, mocks, HTTP tests, or feature test coverage in StockFlow.'
applyTo: 'src/**/*.spec.ts'
---

# Unit test guidelines

- Use the existing Angular CLI test target with Vitest and JSDOM. Run `npm test`; do not pass `--browsers` unless a browser provider has intentionally been installed and configured.
- Test observable behavior and business rules rather than private members, incidental implementation details, CSS class names, or exact markup structure.
- For a component behavior involving its template, use `TestBed` and `ComponentFixture` to exercise the rendered DOM and user interaction. Configure only the providers and imports the test needs. Await Angular stability when rendering or asynchronous work requires it.
- Test pure functions and isolated services directly where possible. Use `TestBed` for Angular dependency injection and replace only external or nondeterministic dependencies with small, typed stubs.
- Use Vitest's `vi.fn()`/`vi.spyOn()` for controlled mocks and interaction assertions. Reset mock state between tests; avoid shared mutable fixtures and real network calls.
- For `HttpClient` services, use Angular's HTTP testing providers/controller to assert the request and flush success and failure responses; never call a live API from a unit test.
- For NgRx SignalStore, inject a fresh store through `TestBed` per test and assert public state/method behavior. Cover meaningful transitions, computed values, resets, and async outcomes without depending on private implementation. Follow [the NgRx state instructions](./ngrx.instructions.md).
- Make tests deterministic: avoid arbitrary timeouts, real clocks, external services, and order-dependent state. Assert meaningful success, validation, empty, permission-denied, and error cases as appropriate to the feature.
- For role tests, use only the approved role/permission matrix. For inventory and invoices, use only agreed business rules; do not invent quantity invariants, taxes, rounding, numbering, or lifecycle transitions to make a test pass.
- Prefer a few focused tests with clear setup and expectations over broad snapshots or redundant assertions. Coverage is useful as a signal, not a substitute for meaningful behavior checks.
- Match the Angular version installed in this repository. Current online examples may use newer APIs such as Angular 22's `@Service`; do not copy an API unless this project's version supports it.

References: [Angular testing overview](https://angular.dev/guide/testing), [component testing](https://angular.dev/guide/testing/components-basics), and [service testing](https://angular.dev/guide/testing/services).
