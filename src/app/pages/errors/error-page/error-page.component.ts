import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';

import { HttpErrorStore } from '../../../core/http/http-error.store';
import { ThemeToggleComponent } from '../../../shared/theme-toggle/theme-toggle.component';

export type HttpErrorStatus = 400 | 401 | 403 | 404 | 500;

const supportedStatuses = new Set<number>([400, 401, 403, 404, 500]);

export function parseHttpErrorStatus(value: string | null): HttpErrorStatus {
  const status = Number(value);
  return supportedStatuses.has(status) ? (status as HttpErrorStatus) : 404;
}

/**
 * Wyświetla objaśnienie znanego błędu HTTP i prowadzi użytkownika do logowania.
 * Obsługuje kody 400, 401, 403, 404 i 500; nieznane adresy błędów pokazuje jako 404.
 * Pozwala też przełączyć motyw zapisywany lokalnie. Ta strona opisuje stan interfejsu
 * i nie zastępuje autoryzacji po stronie backendu.
 */
@Component({
  selector: 'app-error-page',
  imports: [RouterLink, ThemeToggleComponent, TranslatePipe],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly httpErrorStore = inject(HttpErrorStore);
  protected readonly status = toSignal(
    this.route.paramMap.pipe(map((params) => parseHttpErrorStatus(params.get('status')))),
    { initialValue: parseHttpErrorStatus(this.route.snapshot.paramMap.get('status')) },
  );
  protected readonly titleKey = computed(() => `errorPages.${this.status()}.title`);
  protected readonly descriptionKey = computed(() => `errorPages.${this.status()}.description`);

  protected clearNotification(): void {
    this.httpErrorStore.clear();
  }
}
