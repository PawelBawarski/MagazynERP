import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';

import { SessionService } from '../../core/auth/session.service';
import { MockProductCatalogAdapter } from '../../core/mocks/mock-product-catalog.adapter';
import { PRODUCT_CATALOG_PORT } from '../../core/products/product-catalog.service';
import { ProductCatalogComponent } from './product-catalog.component';

describe('ProductCatalogComponent', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ProductCatalogComponent],
      providers: [
        provideTranslateService({ fallbackLang: 'pl' }),
        { provide: PRODUCT_CATALOG_PORT, useClass: MockProductCatalogAdapter },
      ],
    }).compileComponents();
  });

  it('shows the demo catalog with all approved fields and does not expose write actions', () => {
    const fixture = TestBed.createComponent(ProductCatalogComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('tbody tr')).toHaveLength(3);
    expect(element.textContent).toContain('SF-BOX-001');
    expect(element.textContent).toContain('Karton klapowy 300 × 200 × 150 mm');
    expect(element.textContent).toContain('Opakowania');
    expect(element.textContent).toContain('szt.');
    expect(element.textContent).toContain('products.demoNotice');
    expect(element.querySelector('.products__header button')).toBeNull();
    expect(element.querySelectorAll('tbody button')).toHaveLength(0);
  });

  it('filters products case-insensitively and shows an empty state when there are no matches', () => {
    const fixture = TestBed.createComponent(ProductCatalogComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const search = element.querySelector('#product-search') as HTMLInputElement;

    search.value = 'ETYKIETY';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(element.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(element.textContent).toContain('SF-LABEL-A6');

    search.value = 'not found';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(element.querySelectorAll('tbody tr')).toHaveLength(0);
    expect(element.querySelector('[role="status"]')).not.toBeNull();
  });

  it('allows an office worker to add a product with the required fields and selected status', () => {
    TestBed.inject(SessionService).enterSession('office-worker');
    const fixture = TestBed.createComponent(ProductCatalogComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const dialog = element.querySelector('dialog') as HTMLDialogElement;
    Object.assign(dialog, {
      showModal: () => dialog.setAttribute('open', ''),
      close: () => dialog.removeAttribute('open'),
    });

    element.querySelector('.products__header button')?.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    setInput(element, '#product-sku', 'SF-NEW-1');
    setInput(element, '#product-name', 'New product');
    setInput(element, '#product-category', 'New category');
    setInput(element, '#product-unit', 'pcs');
    const status = element.querySelector('#product-status') as HTMLSelectElement;
    status.value = 'inactive';
    status.dispatchEvent(new Event('change', { bubbles: true }));
    element
      .querySelector('.products__form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(element.querySelectorAll('tbody tr')).toHaveLength(4);
    expect(element.textContent).toContain('SF-NEW-1');
    expect(element.textContent).toContain('New product');
    expect(element.textContent).toContain('products.addSuccess');
  });

  it('allows an administrator to edit a product and select its status', () => {
    TestBed.inject(SessionService).enterSession('administrator');
    const fixture = TestBed.createComponent(ProductCatalogComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const dialog = element.querySelector('dialog') as HTMLDialogElement;
    Object.assign(dialog, {
      showModal: () => dialog.setAttribute('open', ''),
      close: () => dialog.removeAttribute('open'),
    });

    element.querySelector('tbody tr button')?.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    setInput(element, '#product-name', 'Renamed carton');
    const status = element.querySelector('#product-status') as HTMLSelectElement;
    status.value = 'inactive';
    status.dispatchEvent(new Event('change', { bubbles: true }));
    element
      .querySelector('.products__form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(element.textContent).toContain('Renamed carton');
    expect(element.textContent).toContain('products.updateSuccess');
    expect(element.querySelector('tbody tr .products__status--inactive')).not.toBeNull();
  });

  it('does not show product write actions to a warehouse role', () => {
    TestBed.inject(SessionService).enterSession('warehouse-clerk');
    const fixture = TestBed.createComponent(ProductCatalogComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.products__header button')).toBeNull();
    expect(element.querySelectorAll('tbody button')).toHaveLength(0);
  });
});

function setInput(element: HTMLElement, selector: string, value: string): void {
  const input = element.querySelector(selector) as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}
