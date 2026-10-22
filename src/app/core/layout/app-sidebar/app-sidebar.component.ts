import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideLayoutDashboard, LucidePackage, LucideUsers } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

import {
  PRODUCT_CATALOG_READ_PERMISSION,
  USER_MANAGEMENT_PERMISSION,
  hasPermission,
} from '../../access-control/role-permissions';
import { SessionService } from '../../auth/session.service';

/**
 * Wyświetla nawigację obszaru roboczego z linkiem do pulpitu.
 * Menu może być rozwinięte lub zwinięte; niedostępne moduły nie są pokazywane jako działające.
 */
@Component({
  selector: 'app-sidebar',
  imports: [
    LucideLayoutDashboard,
    LucidePackage,
    LucideUsers,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
  ],
  templateUrl: './app-sidebar.component.html',
  styleUrl: './app-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSidebarComponent {
  private readonly session = inject(SessionService);

  readonly expanded = input.required<boolean>();
  readonly navigate = output<void>();
  protected readonly canManageUsers = computed(() =>
    hasPermission(this.session.roleId() ?? '', USER_MANAGEMENT_PERMISSION),
  );
  protected readonly canReadProductCatalog = computed(() =>
    hasPermission(this.session.roleId() ?? '', PRODUCT_CATALOG_READ_PERMISSION),
  );
}
