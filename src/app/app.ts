import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LucideX } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

import { brandConfig } from './core/config/brand.config';
import { ThemeService } from './core/appearance/theme.service';
import { HttpErrorStore } from './core/http/http-error.store';

@Component({
  selector: 'app-root',
  imports: [LucideX, RouterLink, RouterOutlet, TranslatePipe],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly httpError = inject(HttpErrorStore);

  constructor() {
    inject(ThemeService);
    inject(Title).setTitle(`${brandConfig.applicationName} v${brandConfig.applicationVersion}`);
  }
}
