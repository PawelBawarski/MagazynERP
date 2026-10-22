import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { SessionService } from '../../auth/session.service';
import { AppFooterComponent } from '../app-footer/app-footer.component';
import { AppSidebarComponent } from '../app-sidebar/app-sidebar.component';
import { AppTopbarComponent } from '../app-topbar/app-topbar.component';

/**
 * Zapewnia wspólny układ chronionego obszaru StockFlow: pasek górny, nawigację,
 * miejsce robocze i stopkę.
 */
@Component({
  selector: 'app-shell',
  imports: [
    AppFooterComponent,
    AppSidebarComponent,
    AppTopbarComponent,
    RouterOutlet,
    TranslatePipe,
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class AppShellComponent {
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);
  protected readonly menuExpanded = signal(false);

  protected toggleMenu(): void {
    this.menuExpanded.update((expanded) => !expanded);
  }

  protected closeMenu(): void {
    this.menuExpanded.set(false);
  }

  protected leaveWorkspace(): void {
    this.session.leaveSession();
    void this.router.navigateByUrl('/login');
  }
}
