---
description: 'Use when editing Electron main-process code, preload scripts, packaging configuration, IPC, or desktop-specific behavior in StockFlow.'
applyTo:
  - 'electron/**/*.cjs'
  - 'electron/**/*.js'
---

# Electron desktop guidelines

- Keep the Electron main process small and responsible for native window lifecycle and narrowly scoped desktop capabilities. Keep ERP domain rules and ordinary UI in the Angular renderer or trusted backend.
- Keep `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, and `webSecurity: true`. Never expose Node primitives or generic IPC send/invoke APIs to the renderer.
- If a native capability is required, expose only a narrowly typed operation through `contextBridge` in preload and validate every IPC sender and payload in the main process.
- Restrict renderer navigation to the trusted app entry or the configured development server. Open only explicitly allowed external HTTPS links with the system browser; do not permit arbitrary protocols.
- Never place credentials, API secrets, user data, or authorization decisions in the main process source, app bundle, URLs, or logs.
- Keep packaged asset paths and relative Angular build URLs aligned. Preserve hash-based routing for local-file app loading.
- Verify main/preload syntax, the Angular web build, the Electron renderer build, and relevant tests after desktop changes. Do not claim installer packaging works without running the packaging command.
