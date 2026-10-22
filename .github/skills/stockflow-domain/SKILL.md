---
name: stockflow-domain
description: 'Design or implement StockFlow warehouse workflows, inventory, stock movements, users, roles, and permissions. Use when changing warehouse or access-control behavior.'
---

# StockFlow ERP domain

Use this workflow when adding or changing ERP workflows, including warehouse, inventory, users, roles, and permissions.

1. Read the existing domain models, API contracts, routes, and tests. Distinguish implemented behavior from planned behavior.
2. Establish the exact workflow, actors, permission matrix, and failure cases from existing product requirements. If role names, permissions, stock rules, or approval behavior are unspecified, ask before encoding them.
   - The extensible frontend role/permission catalog is `src/app/core/access-control/role-permissions.ts`. Keep role IDs stable and English-facing role names in the catalog.
   - The currently approved user-management permissions are `users.manage` for Administrator and Office Worker, and `users.assign-administrator` for Administrator only. Other permission mappings remain unspecified. Do not grant administrator `*` or assume administrators can do everything.
   - Add new roles to the central catalog. Add permission definitions and explicit role mappings only after approval, then test allowed, denied, and unknown-role cases.
3. Model quantity changes as explicit, auditable stock movements with a reason and relevant source/destination where the requirements call for them. Never silently edit stock balances to conceal a movement.
4. Once a backend exists, use it as the authority for permissions and inventory invariants; UI guards are supplementary only. Until then, any mock is for interface development only and must not be described as persistent, authoritative, or secure.
5. Follow existing transaction, concurrency, and idempotency guarantees. Surface conflicts and API failures clearly; do not fabricate success states or silently retry non-idempotent actions.
6. Add tests covering allowed and denied role actions, invalid transitions, quantity boundaries, and relevant failure/conflict behavior. Do not claim that frontend-only tests prove backend authorization.
7. Keep business rules and API contracts platform-independent so web, Electron desktop, and a future mobile client do not implement conflicting versions of the same ERP workflow.
   - Keep services used only by one page in that page's `services/` subfolder. Keep shared domain services, contracts, and adapters in `src/app/core/`.
8. Add a concise Polish JSDoc summary to each feature component describing the confirmed user workflow and permission constraints in client-documentation-ready language. Update it alongside behavior changes and never invent policy.
9. Until the planned C#/.NET and PostgreSQL backend is implemented, load [the temporary mock-backend skill](../temporary-mock-backend/SKILL.md) for any mocked data or API work.
10. Frontend role checks are only for UI visibility/navigation. They do not authorize requests; the future .NET backend must enforce the approved matrix.
