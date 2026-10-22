import { Injectable } from '@angular/core';

import {
  ProductCatalogDraft,
  ProductCatalogError,
  ProductCatalogItem,
} from '../products/product-catalog.models';
import { ProductCatalogPort } from '../products/product-catalog.port';

const DEMONSTRATION_PRODUCTS: readonly ProductCatalogItem[] = [
  {
    id: 'product-001',
    sku: 'SF-BOX-001',
    name: 'Karton klapowy 300 × 200 × 150 mm',
    category: 'Opakowania',
    unit: 'szt.',
    isActive: true,
  },
  {
    id: 'product-002',
    sku: 'SF-TAPE-048',
    name: 'Taśma pakowa 48 mm',
    category: 'Materiały pakowe',
    unit: 'rol.',
    isActive: true,
  },
  {
    id: 'product-003',
    sku: 'SF-LABEL-A6',
    name: 'Etykieta logistyczna A6',
    category: 'Etykiety',
    unit: 'ark.',
    isActive: false,
  },
];

/** Adapter demonstracyjny przechowujący zmiany w pamięci; zastąpić implementacją uzgodnionego API. */
@Injectable({ providedIn: 'root' })
export class MockProductCatalogAdapter implements ProductCatalogPort {
  private products = DEMONSTRATION_PRODUCTS.map((product) => ({ ...product }));
  private nextId = this.products.length + 1;

  add(input: ProductCatalogDraft): ProductCatalogItem {
    const product = normalizeProduct(input);
    const created: ProductCatalogItem = {
      id: `product-${String(this.nextId).padStart(3, '0')}`,
      ...product,
    };
    this.nextId += 1;
    this.products = [...this.products, created];
    return { ...created };
  }

  getAll(): readonly ProductCatalogItem[] {
    return this.products.map((product) => ({ ...product }));
  }

  update(id: string, input: ProductCatalogDraft): ProductCatalogItem {
    const current = this.products.find((product) => product.id === id);
    if (!current) {
      throw new ProductCatalogError('not-found');
    }

    const updated = { ...current, ...normalizeProduct(input) };
    this.products = this.products.map((product) => (product.id === id ? updated : product));
    return { ...updated };
  }
}

function normalizeProduct(input: ProductCatalogDraft): ProductCatalogDraft {
  const product = {
    sku: input.sku.trim(),
    name: input.name.trim(),
    category: input.category.trim(),
    unit: input.unit.trim(),
    isActive: input.isActive,
  };

  if (!product.sku || !product.name || !product.category || !product.unit) {
    throw new ProductCatalogError('invalid-input');
  }

  return product;
}
