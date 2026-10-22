import { ProductCatalogDraft, ProductCatalogItem } from './product-catalog.models';

export interface ProductCatalogPort {
  add(product: ProductCatalogDraft): ProductCatalogItem;
  getAll(): readonly ProductCatalogItem[];
  update(id: string, product: ProductCatalogDraft): ProductCatalogItem;
}
