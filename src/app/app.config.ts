import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { apiInterceptor } from './core/http/api.interceptor';
import { MockProductCatalogAdapter } from './core/mocks/mock-product-catalog.adapter';
import { MockUserDirectoryAdapter } from './core/mocks/mock-user-directory.adapter';
import { PRODUCT_CATALOG_PORT } from './core/products/product-catalog.service';
import { USER_DIRECTORY_PORT } from './core/users/user-directory.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: PRODUCT_CATALOG_PORT, useExisting: MockProductCatalogAdapter },
    { provide: USER_DIRECTORY_PORT, useExisting: MockUserDirectoryAdapter },
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptors([apiInterceptor])),
    provideTranslateService({
      fallbackLang: 'pl',
    }),
  ],
};
