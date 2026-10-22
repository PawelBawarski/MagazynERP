---
name: temporary-mock-backend
description: 'Use while developing StockFlow frontend features without a backend. Create isolated, replaceable mock API/data adapters before the future C#/.NET and PostgreSQL backend is available.'
---

# Temporary frontend mock backend

This skill is intentionally temporary. StockFlow version 0.0.1 has no backend; the planned backend is C#/.NET with PostgreSQL. Use this workflow only for frontend development that needs controlled API-like data. Remove this skill when the real backend integration replaces the mocks.

## Workflow

1. Inspect existing feature services, DTOs, route setup, tests, and environment configuration. Do not create mock behavior if a real implementation already exists.
2. Keep mock responses and fixtures separate from components, preferably in a clearly named `src/app/core/mocks/` implementation behind the feature's typed service/facade. Components must depend on the service contract, not import mock records or branch on `isMock`.
   - Put services used only by one page in that page's `services/` subfolder. Keep shared service contracts, adapters, and mocks under `core/`.
3. Keep the service API and typed DTOs replaceable by the agreed future HTTP API. Treat names and shapes as provisional until confirmed by the backend contract; do not claim compatibility without agreement.
4. Make responses deterministic and local. Simulate loading or errors only when that state is useful to the UI/tests; never make real network calls or add arbitrary delays to production behavior.
5. Clearly label mock-only behavior in Polish component documentation and UI where users could mistake it for real data. Do not log sensitive-looking sample data.
6. Never treat mocks as persistence, authentication, authorization, or a security boundary. Do not silently accept login, grant roles, enforce stock movements authoritatively, or issue legally meaningful invoices from a client-only mock.
7. Ask for requirements before inventing role/permission mappings, inventory invariants, invoice numbering, currency/tax/rounding rules, or lifecycle transitions. Use tests for agreed behavior; frontend tests do not prove backend security or transactional guarantees.
8. Document mock-only assumptions and the replacement point near the adapter, and add focused service/component tests using controlled fixtures.

## Removal when the real backend starts

1. Replace the mock adapter with an HTTP implementation behind the same agreed feature service boundary.
2. Keep component and presentation tests. Replace fake-data service tests with HTTP contract tests and integration coverage appropriate to the real API.
3. Remove mock fixture data, mock-only providers/configuration, fake latency, and fake-only tests after confirming no production feature imports them.
4. Remove this skill and references to it from `.github/copilot-instructions.md`, custom agents, and domain skills. Keep legitimate architecture, testing, and API-contract guidance.
5. Verify `npm test`, `npm run build`, and the integration path against the real backend before claiming the mock replacement is complete.
