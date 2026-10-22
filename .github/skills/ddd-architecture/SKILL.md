---
name: ddd-architecture
description: 'Use when reviewing or designing Domain-Driven Design (DDD), domain boundaries, bounded contexts, aggregates, entities, value objects, domain services, ports, adapters, or business workflows in StockFlow.'
---

# Domain-Driven Design for StockFlow

Use this workflow for DDD architecture reviews and domain-heavy features. Apply DDD to clarify real business rules and boundaries; do not add patterns or layers just to make the code look more "domain-driven".

## StockFlow constraints

- StockFlow currently has an Angular 21 web application and an Electron shell, but no .NET/PostgreSQL backend. Treat frontend models, service contracts, and mock data as provisional; do not present them as authoritative domain rules, persistence, authorization, or transaction guarantees.
- Keep the renderer portable across web and Electron. Platform-specific details belong in adapters or the Electron shell, not in domain concepts.
- Do not invent roles, permission grants, stock invariants, invoice numbering, currency, tax, rounding, or lifecycle transitions. Ask when requirements are missing.
- Authorization, inventory integrity, financial correctness, and persistence guarantees ultimately belong to the trusted backend/API when it exists. UI guards and client state are not security boundaries.

## Review and design workflow

1. Inspect the actual workflows, domain vocabulary, contracts, tests, routes, state, and adapters before proposing boundaries. Separate implemented behavior from roadmap plans and mock-only behavior.
2. Identify the business capabilities and candidate bounded contexts from distinct language and rules, not from current folder names. Record ownership, dependencies, and uncertain terminology; do not split a small application into artificial services or contexts.
3. Locate business decisions and invariants. Distinguish them from UI validation, orchestration, API transport, and presentation state. If the rules are not confirmed, report the gap instead of encoding a guess.
4. Use entities when identity and lifecycle matter; use value objects for values with meaningful validation or equality; use aggregates only where a consistency boundary and invariants justify them. Keep aggregate changes explicit and testable.
5. Use domain services only for domain behavior that does not naturally belong to one entity/value object. Use application services/facades to coordinate use cases and ports to express required external capabilities. Put replaceable HTTP/mock/persistence implementations in adapters.
6. Introduce domain events only for meaningful business facts and concrete coordination needs. Do not confuse UI events, RxJS emissions, NgRx actions, or HTTP responses with domain events by default.
7. Keep frontend mock adapters isolated behind typed contracts until backend contracts are agreed. Do not claim atomicity, persistence, or backend authorization from frontend-only structure or tests.
8. Report findings with evidence and severity/impact, distinguishing current risks from future design opportunities. For read-only reviews, do not edit or refactor code unless asked.

## Angular Signals and NgRx

- Angular signals are a reactive mechanism for component-local state and derived values; they are not DDD entities, value objects, aggregates, or domain events.
- Keep ephemeral view/form state local. Use NgRx SignalStore when cohesive feature/shared state or a stateful workflow needs a clear shared owner. A store is an application-state boundary, not automatically a domain model or domain layer.
- Keep domain rules independent of Angular signals and NgRx when those rules are established and need reuse, consistency, or authoritative enforcement. In this frontend-only project, avoid building a speculative parallel backend domain model.
- Use classic NgRx Store/Effects only for a concrete need such as event-driven coordination across features; do not choose it solely because the application is an ERP.

## Teaching while working

When it helps the user understand a real design choice, add a brief Polish explanation of the relevant DDD concept and why it fits (or does not fit) the current code. Similarly explain when local Angular signals are enough and when shared state merits NgRx SignalStore. Keep these explanations occasional, concrete, and tied to inspected code rather than turning every response into a lecture.
