import { inject, Injectable, InjectionToken } from '@angular/core';

import { ProductCatalogDraft, ProductCatalogItem } from './product-catalog.models';
import { ProductCatalogPort } from './product-catalog.port';

export const PRODUCT_CATALOG_PORT = new InjectionToken<ProductCatalogPort>('PRODUCT_CATALOG_PORT');

@Injectable({ providedIn: 'root' })
export class ProductCatalogService {
  private readonly catalog = inject(PRODUCT_CATALOG_PORT);

  add(product: ProductCatalogDraft): ProductCatalogItem {
    return this.catalog.add(product);
  }

  getAll(): readonly ProductCatalogItem[] {
    return this.catalog.getAll();
  }

  update(id: string, product: ProductCatalogDraft): ProductCatalogItem {
    return this.catalog.update(id, product);
  }
}
