import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { ProductCatalogError } from '../products/product-catalog.models';
import { MockProductCatalogAdapter } from './mock-product-catalog.adapter';

describe('MockProductCatalogAdapter', () => {
  let catalog: MockProductCatalogAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    catalog = TestBed.inject(MockProductCatalogAdapter);
  });

  it('returns isolated copies of the demonstration catalog', () => {
    const firstRead = catalog.getAll();
    const secondRead = catalog.getAll();

    expect(firstRead).toHaveLength(3);
    expect(firstRead[0]).toEqual(secondRead[0]);
    expect(firstRead[0]).not.toBe(secondRead[0]);
  });

  it('adds trimmed products and permits duplicate required SKUs', () => {
    const first = catalog.add({
      sku: ' TEST-1 ',
      name: ' Example product ',
      category: ' General ',
      unit: ' pcs ',
      isActive: true,
    });
    const duplicateSku = catalog.add({
      sku: 'TEST-1',
      name: 'Another product',
      category: 'General',
      unit: 'pcs',
      isActive: false,
    });

    expect(first).toMatchObject({
      sku: 'TEST-1',
      name: 'Example product',
      category: 'General',
      unit: 'pcs',
      isActive: true,
    });
    expect(duplicateSku.sku).toBe(first.sku);
    expect(catalog.getAll()).toHaveLength(5);
  });

  it('updates an existing product and rejects missing required fields', () => {
    const product = catalog.getAll()[0];

    expect(
      catalog.update(product.id, {
        sku: product.sku,
        name: 'Updated name',
        category: product.category,
        unit: product.unit,
        isActive: false,
      }).name,
    ).toBe('Updated name');
    expect(() =>
      catalog.add({
        sku: ' ',
        name: 'Product',
        category: 'Category',
        unit: 'unit',
        isActive: true,
      }),
    ).toThrowError(new ProductCatalogError('invalid-input'));
  });

  it('reports an unknown product when an update cannot find its ID', () => {
    expect(() =>
      catalog.update('unknown-product', {
        sku: 'SKU',
        name: 'Product',
        category: 'Category',
        unit: 'unit',
        isActive: true,
      }),
    ).toThrowError(new ProductCatalogError('not-found'));
  });
});
