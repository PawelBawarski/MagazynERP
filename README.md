# Stockflow

**Wersja aplikacji: 0.0.1**

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.27.

## Web development

Install dependencies with `npm install`, then run `npm start`. The web app is served at `http://localhost:4200/`.

## Desktop development (Electron)

Run `npm run electron:dev` to start Angular and open the Electron desktop window.

- `npm run electron:build:web` builds the Angular renderer with relative asset URLs for desktop packaging.
- `npm run electron:pack` creates an unpacked desktop app for local testing.
- `npm run electron:make` creates a Windows installer.

Electron's main process is in `electron/main.cjs`. Renderer navigation uses hash-based routing so it also works when loaded from a local packaged file. Keep Electron APIs out of the renderer; add a narrowly scoped, reviewed preload bridge only when a concrete desktop capability requires one.

The Angular application remains the shared UI for web and desktop. Mobile packaging is intentionally not configured yet; evaluate Capacitor when the mobile application scope and native-device requirements are known.

## State management

The project uses Angular signals for component-local state and NgRx SignalStore (`@ngrx/signals`) for cohesive shared state. The first store is the app-shell HTTP error notification state. Add classic NgRx Store/Effects only when a real cross-feature or event-driven workflow requires it. See `.github/skills/ngrx-state-management/SKILL.md` for project conventions.

## Data tables

StockFlow uses [Angular Material Table](https://material.angular.dev/components/table/overview) and the Angular CDK. Both are free and distributed under the MIT license. A Material theme is loaded globally; feature components import only the table modules they use.

For a basic typed table, import `MatTableModule` in the standalone feature component and define column templates:

```ts
import { Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

interface InventoryItem {
  sku: string;
  name: string;
  quantity: number;
}

@Component({
  imports: [MatTableModule],
  template: `
    <table mat-table [dataSource]="items()" aria-label="Inventory items">
      <ng-container matColumnDef="sku">
        <th mat-header-cell *matHeaderCellDef>SKU</th>
        <td mat-cell *matCellDef="let item">{{ item.sku }}</td>
      </ng-container>
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Item</th>
        <td mat-cell *matCellDef="let item">{{ item.name }}</td>
      </ng-container>
      <ng-container matColumnDef="quantity">
        <th mat-header-cell *matHeaderCellDef>Quantity</th>
        <td mat-cell *matCellDef="let item">{{ item.quantity }}</td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
})
export class InventoryTableComponent {
  readonly items = input.required<readonly InventoryItem[]>();
  readonly displayedColumns = ['sku', 'name', 'quantity'];
}
```

Import `MatSortModule` and `MatPaginatorModule` in the feature when sorting or pagination is needed. For sorting, bind `matSort` and `mat-sort-header` to a `MatTableDataSource`; connect its sort and paginator instances in the component. Keep column formatting, row actions, loading/empty states, and localization specific to each feature rather than forcing ERP tables into one generic layout. Data must come from the feature's service or API adapter, not hard-coded sample records.

## Icons

The application uses [Lucide for Angular](https://lucide.dev/guide/packages/angular), an open-source icon library under the ISC license. Icons are rendered as inline SVG, bundled with the application, and do not require an external icon font or network request. Import only the icons a standalone component uses:

```ts
import { Component } from '@angular/core';
import { LucideSearch } from '@lucide/angular';

@Component({
  imports: [LucideSearch],
  template: `
    <button type="button" aria-label="Search inventory">
      <svg lucideSearch aria-hidden="true" [size]="20" />
    </button>
  `,
})
export class InventorySearchButtonComponent {}
```

Use the button's accessible name for an icon-only action and mark decorative SVG icons as hidden from assistive technology. Browse available icons at [lucide.dev/icons](https://lucide.dev/icons/). The theme toggle is the first application control using Lucide icons.

## Localization

Polish and English dictionaries live in `src/app/core/i18n/translations/`. `LocalizationService` applies the selected language to ngx-translate and the document's `lang` attribute, and persists the preference under `stockflow.language` in `localStorage`. Unsupported or missing values default to Polish; if storage is unavailable, language switching still works for the current session.

## Design tokens and theme

Shared application styles and visual tokens are defined in `src/main-style.scss` and loaded by `src/styles.scss`. Use the `--sf-*` CSS custom properties for colors, typography, spacing, radii, controls, and content widths instead of introducing new repeated values in feature styles. Update both `:root` (light) and `:root[data-theme='dark']` when changing theme colors. Angular Material system colors are mapped to the same tokens.

The reusable `ThemeToggleComponent` switches themes on the login and error pages. `ThemeService` applies the selected theme to the document and saves it under `stockflow.theme` in `localStorage`. Light mode is the default; unsupported values fall back to light. If browser storage is unavailable, theme switching still works for the current session.

## Roles and permissions

The extensible role catalog is in `src/app/core/access-control/role-permissions.ts`. It defines `Administrator`, `Office Worker`, `Warehouse Clerk`, and `Warehouse Operative` using stable English identifiers. The user-management page is visible to Administrators and Office Workers; only Administrators can assign the Administrator position. These client-side checks are for navigation and presentation only; the future backend must enforce authorization.

## User management

The `/app/users` page supports adding users, deactivating active users, searching, status filtering, sorting, incremental list loading, and full-list CSV/PDF reports. The PDF action opens the browser print dialog, where the report can be saved as PDF. The CSV is downloaded directly.

`UserDirectoryService` depends on `USER_DIRECTORY_PORT`; the current `MockUserDirectoryAdapter` keeps entries in memory. Replace its provider with an agreed API adapter when the backend is available. The current login assigns the Administrator interface role only for `admin@admin.pl` / `admin`; other valid form submissions receive the Office Worker interface role. Neither this role selection nor route guards authenticate a user or secure data.

## Prepared API clients

`AuthApiService` in `src/app/pages/auth/login/services/` and `UserDirectoryApiService` in `src/app/pages/users/services/` provide unconnected HTTP calls for the planned backend. They do not replace the current login flow or in-memory user directory and are not registered as the user-directory adapter. `UserDirectoryService`, its port, and domain models remain in `src/app/core/users/` as the shared boundary; the in-memory adapter remains isolated in `src/app/core/mocks/`. The provisional API shape is `POST /api/auth/login` with an email and password, returning an access token and user role; user operations use `GET /api/users` with paging/filter/sort query parameters, `POST /api/users`, and `PATCH /api/users/{id}/deactivate`. The final routes and DTOs must be agreed with the .NET backend before connecting these services. Login responses are returned to the caller; the service does not persist credentials or tokens.

## Application access

The `/app` routes use client-side guards to manage navigation. These guards are not a security boundary; the backend must enforce authentication and authorization for protected data and operations.

## Backend status

Version 0.0.1 has no backend. The planned backend is C#/.NET with PostgreSQL. Any temporary API data used during frontend development must remain isolated behind replaceable service adapters and must not be treated as real persistence or security.

For the current implementation status and remaining ERP work, see the [StockFlow ERP roadmap](./docs/erp-roadmap.md).

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
# MagazynERP
