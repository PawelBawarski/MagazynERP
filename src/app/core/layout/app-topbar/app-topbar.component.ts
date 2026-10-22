import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideLogOut, LucideMenu } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

import { ThemeToggleComponent } from '../../../shared/theme-toggle/theme-toggle.component';
import { brandConfig } from '../../config/brand.config';
import { AppLanguage, LocalizationService } from '../../i18n/localization.service';

/**
 * Udostępnia pasek nawigacji, wybór języka i motywu oraz wyjście z obszaru roboczego.
 */
@Component({
  selector: 'app-topbar',
  imports: [LucideLogOut, LucideMenu, RouterLink, ThemeToggleComponent, TranslatePipe],
  templateUrl: './app-topbar.component.html',
  styleUrl: './app-topbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTopbarComponent {
  private readonly localization = inject(LocalizationService);

  readonly menuExpanded = input.required<boolean>();
  readonly menuToggle = output<void>();
  readonly logout = output<void>();
  protected readonly companyName = brandConfig.companyName;
  protected readonly language = this.localization.language;

  protected setLanguage(event: Event): void {
    const target = event.target;
    const language: AppLanguage =
      target instanceof HTMLSelectElement && target.value === 'en' ? 'en' : 'pl';
    this.localization.setLanguage(language);
  }
}
