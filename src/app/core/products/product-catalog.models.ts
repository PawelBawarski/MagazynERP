export interface ProductCatalogItem {
  readonly id: string;
  readonly sku: string;
  readonly name: string;
  readonly category: string;
  readonly unit: string;
  readonly isActive: boolean;
}

export interface ProductCatalogDraft {
  readonly sku: string;
  readonly name: string;
  readonly category: string;
  readonly unit: string;
  readonly isActive: boolean;
}

export type ProductCatalogErrorCode = 'invalid-input' | 'not-found';

export class ProductCatalogError extends Error {
  constructor(readonly code: ProductCatalogErrorCode) {
    super(code);
    this.name = 'ProductCatalogError';
  }
}
