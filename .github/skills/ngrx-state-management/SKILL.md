---
name: ngrx-state-management
description: 'Design, implement, test, or refactor Angular state with NgRx SignalStore or classic NgRx Store. Use for shared state, feature state, rxMethod, selectors, effects, reducers, and NgRx architecture decisions in StockFlow.'
---

# NgRx state management for StockFlow

Use this skill for state architecture, adding a store, feature-level state, async API workflows, or NgRx unit tests. This workspace uses Angular 21 and `@ngrx/signals` 21.

## Choose the smallest appropriate tool

1. Keep state in a component with Angular signals when it is short-lived and belongs only to that component. Keep Reactive Forms as the form model; do not duplicate all form controls into the store.
2. Use SignalStore for a coherent feature state or a small shared app state with typed state, derived signals, and named methods. This is the default NgRx approach in this project.
3. Use classic `@ngrx/store` with reducers, actions, selectors, and Effects only when there is a concrete requirement for event-driven global state, complex cross-feature coordination, normalized shared entities, time-travel/debug tooling, or an established team convention. Do not install it speculatively.
4. Do not create stores for trivial one-off booleans, static configuration, or values already managed by a form/router.

## Implement

1. Inspect the installed `@ngrx/*` versions and official NgRx guides before using APIs. Do not copy examples from a different major version.
2. Define a focused, typed state shape. Keep private implementation details out of public state and never put secrets or sensitive financial/customer data in store state.
3. Compose SignalStore with `signalStore`, `withState`, `withComputed`, and `withMethods` as needed. Use immutable `patchState` updates; do not mutate state in place.
4. Keep transitions explicit and predictable. Use computed state for derivations rather than maintaining duplicate values.
5. For async workflows, represent loading, success/data, empty, and error outcomes explicitly. Use `rxMethod` and appropriate RxJS operators only when reactive triggering/cancellation/concurrency behavior is required; otherwise a simple method is clearer. Surface errors and preserve cancellation semantics.
6. Let components consume readonly state and call public store methods. Keep rendering, forms, and accessibility in the component; keep business/API workflow orchestration in a feature store or service with one clear owner.
7. For ERP workflows, do not move trusted authorization, stock invariants, invoice calculations, or persistence guarantees into client state. Follow the domain and invoice skills; ask when business rules are unspecified.
8. Add focused tests for state transitions, computed values, async success/error and concurrency behavior, and reset behavior where relevant. Avoid asserting private store internals.
9. Run relevant tests and `npm run build`; report exactly which behavior is client state versus backend-authoritative.

## Current project example

`src/app/core/http/http-error.store.ts` is the shared app-shell SignalStore for translated HTTP error feedback: an interceptor reports a status, the root shell reads `messageKey`, and the dismiss action clears it. This is shared UI feedback, not an API/data/auth store. Component-only state remains local.

## Official references

- [NgRx SignalStore](https://ngrx.io/guide/signals/signal-store)
- [NgRx Signals overview](https://ngrx.io/guide/signals)
- [NgRx classic Store](https://ngrx.io/guide/store)
- [NgRx Effects](https://ngrx.io/guide/effects)
- [NgRx Operators](https://ngrx.io/guide/operators)
