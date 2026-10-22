import { ChangeDetectionStrategy, Component } from '@angular/core';

import { brandConfig } from '../../config/brand.config';

/**
 * Pokazuje nazwę aplikacji i jej wersję.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFooterComponent {
  protected readonly applicationName = brandConfig.applicationName;
  protected readonly applicationVersion = brandConfig.applicationVersion;
}
