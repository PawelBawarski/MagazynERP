---
name: electron-desktop
description: "Develop, package, or debug StockFlow's Electron desktop app, including main process, preload, IPC, security, native capabilities, and Angular renderer builds."
---

# StockFlow Electron desktop

Use this workflow when changing Electron startup, desktop windows, preload/IPC, native device integrations, or desktop packaging.

1. Read `package.json`, `electron/main.cjs`, the Electron instruction file, and Angular output path configuration. Verify installed Electron and Electron Builder versions before relying on APIs.
2. Keep the Angular renderer shared with the web application. Put only native window lifecycle and required device/system integration in Electron's main process. Keep ERP workflows and API authorization out of the Electron shell.
3. Preserve the security boundary: context isolation, sandbox, web security, disabled Node integration, trusted-navigation allowlist, and narrowly scoped validated IPC only for a defined native capability. Never add generic IPC bridges or ship secrets.
4. Preserve hash-based Angular routing and relative asset paths in the packaged Angular build. Do not move Electron native capabilities into renderer-side browser code.
5. For development, run `npm run electron:dev`. For packaging, build first with `npm run electron:build:web`, then verify with `npm run electron:pack`; create the configured Windows installer with `npm run electron:make`.
6. Test any exposed preload/IPC contract from both sides. Do not assert that a successful Angular build proves the desktop window loads or that the installer is valid; execute the relevant desktop command.
7. Treat mobile as future work unless explicitly requested. Evaluate Capacitor and native plugins based on concrete mobile needs rather than coupling them to Electron.
