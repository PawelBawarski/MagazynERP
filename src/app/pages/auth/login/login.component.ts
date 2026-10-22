import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideArrowRight } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

import { SessionService } from '../../../core/auth/session.service';
import { getLoginRole } from '../../../core/auth/login-role';
import { brandConfig } from '../../../core/config/brand.config';
import { AppLanguage, LocalizationService } from '../../../core/i18n/localization.service';
import { ThemeToggleComponent } from '../../../shared/theme-toggle/theme-toggle.component';

/**
 * Waliduje wymagane pola i format adresu e-mail, a następnie otwiera obszar aplikacji.
 * Umożliwia też wybór języka i motywu, które są zapisywane lokalnie.
 */
@Component({
  selector: 'app-login',
  imports: [LucideArrowRight, ReactiveFormsModule, ThemeToggleComponent, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly localization = inject(LocalizationService);
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);

  protected readonly companyName = brandConfig.companyName;
  protected readonly applicationVersion = brandConfig.applicationVersion;
  protected readonly language = this.localization.language;
  protected readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected setLanguage(event: Event): void {
    const target = event.target;
    const language: AppLanguage =
      target instanceof HTMLSelectElement && target.value === 'en' ? 'en' : 'pl';
    this.localization.setLanguage(language);
  }

  protected submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    this.session.enterSession(getLoginRole(email, password));
    const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl');
    const destination =
      returnUrl?.startsWith('/') && !returnUrl.startsWith('//') && !returnUrl.includes('\\')
        ? returnUrl
        : '/app/dashboard';
    void this.router.navigateByUrl(destination);
  }
}
