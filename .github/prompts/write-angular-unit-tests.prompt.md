---
description: "Create or improve focused Angular unit tests using the StockFlow Vitest and JSDOM setup."
name: "Write Angular Unit Tests"
argument-hint: "Describe the behavior to test or select the implementation"
agent: "agent"
---

Write or improve unit tests for: ${input:behavior}

Inspect the target implementation, nearby specs, and the project's test configuration first. Follow the `angular-unit-testing` skill and the unit-test instructions in `.github/instructions/unit-testing.instructions.md`.

Use Angular TestBed only where Angular dependency injection or template behavior is part of what needs testing; test pure logic directly. Use typed stubs and Vitest mocks at external boundaries, and use Angular HTTP testing tools rather than live network calls.

Test externally observable behavior, including relevant validation, error, empty, permission, or financial/inventory boundary cases. Do not invent business rules, role permissions, taxes, invoice lifecycle rules, or stock invariants; ask for clarification if these determine expected results.

Run the focused spec and `npm test`. Do not enable browser mode for ordinary unit tests. Report the scenarios covered and any unresolved requirements.
