---
description: 'Use when implementing or reviewing NgRx SignalStore, @ngrx/signals, shared Angular application state, store methods, or state tests in StockFlow.'
applyTo:
  - 'src/app/**/*store.ts'
  - 'src/app/**/*store.spec.ts'
---

# NgRx state management

- This workspace uses Angular 21 and `@ngrx/signals` 21. Follow the NgRx SignalStore guides and APIs available in the installed package.
- Read [the NgRx state-management skill](../skills/ngrx-state-management/SKILL.md) before adding or changing NgRx state.
- Choose state tooling to fit the actual state: keep ephemeral component/form state local; use SignalStore for cohesive feature state or shared app state; introduce classic `@ngrx/store`/Effects only when the product has a clear need for a normalized global event-driven store, complex cross-feature workflows, or an established team convention.
- Keep stores scoped to a feature or application concern. Expose readonly state signals, derive values with `withComputed`, and expose named methods through `withMethods`; update state immutably with `patchState`.
- Keep API orchestration in a store only when that feature owns the workflow. Use `rxMethod`/RxJS with explicit loading/error handling for reactive asynchronous flows. Do not add Effects or RxJS for a synchronous state change.
- Keep components presentation-focused; inject the relevant store and invoke its public methods rather than duplicating shared state.
- Do not place secrets, credentials, sensitive invoice/customer data, or authorization decisions in client state. The backend remains the security authority.
- Avoid a store for a single boolean or state used by only one component. Add unit tests for state transitions, derived values, async success/error paths, and reset behavior as applicable.
