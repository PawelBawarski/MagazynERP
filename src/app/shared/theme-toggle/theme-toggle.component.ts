import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideMoon, LucideSun } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

import { ThemeService } from '../../core/appearance/theme.service';

/**
 * Przełącza jasny i ciemny wygląd aplikacji.
 * Wybrany motyw jest stosowany od razu i zapisywany lokalnie na tym urządzeniu.
 */
@Component({
  selector: 'app-theme-toggle',
  imports: [LucideMoon, LucideSun, TranslatePipe],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);
  protected readonly theme = this.themeService.theme;

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
