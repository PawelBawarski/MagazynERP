import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import {
  PRODUCT_CREATE_PERMISSION,
  PRODUCT_EDIT_PERMISSION,
  hasPermission,
} from '../../core/access-control/role-permissions';
import { SessionService } from '../../core/auth/session.service';
import {
  ProductCatalogError,
  ProductCatalogItem,
} from '../../core/products/product-catalog.models';
import { ProductCatalogService } from '../../core/products/product-catalog.service';

/**
 * Umożliwia wszystkim rolom przeglądanie demonstracyjnego katalogu, a Administratorowi
 * i Pracownikowi biurowemu dodawanie oraz edycję produktów po wymaganych polach formularza.
 * Zmiany są tymczasowe i nie przetrwają odświeżenia strony.
 */
@Component({
  selector: 'app-product-catalog',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCatalogComponent {
  private readonly productDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('productDialog');
  private readonly formBuilder = inject(FormBuilder);
  private readonly productCatalog = inject(ProductCatalogService);
  private readonly session = inject(SessionService);
  private readonly translate = inject(TranslateService);
  private readonly roleId = this.session.roleId;

  protected readonly search = signal('');
  protected readonly products = signal(this.productCatalog.getAll());
  protected readonly errorKey = signal<string | null>(null);
  protected readonly successKey = signal<string | null>(null);
  protected readonly editingProductId = signal<string | null>(null);
  protected readonly canCreateProducts = computed(() =>
    hasPermission(this.roleId() ?? '', PRODUCT_CREATE_PERMISSION),
  );
  protected readonly canEditProducts = computed(() =>
    hasPermission(this.roleId() ?? '', PRODUCT_EDIT_PERMISSION),
  );
  protected readonly filteredProducts = computed(() => {
    const search = this.search().trim().toLocaleLowerCase();
    if (!search) {
      return this.products();
    }

    return this.products().filter((product) =>
      [product.sku, product.name, product.category, product.unit]
        .join(' ')
        .toLocaleLowerCase()
        .includes(search),
    );
  });
  protected readonly productForm = this.formBuilder.nonNullable.group({
    sku: ['', [Validators.required, Validators.pattern(/\S/)]],
    name: ['', [Validators.required, Validators.pattern(/\S/)]],
    category: ['', [Validators.required, Validators.pattern(/\S/)]],
    unit: ['', [Validators.required, Validators.pattern(/\S/)]],
    isActive: ['', Validators.required],
  });

  protected setSearch(value: string): void {
    this.search.set(value);
  }

  protected openAddForm(): void {
    if (!this.canCreateProducts()) {
      this.errorKey.set('products.errors.forbidden');
      return;
    }

    this.editingProductId.set(null);
    this.productForm.reset({ sku: '', name: '', category: '', unit: '', isActive: '' });
    this.errorKey.set(null);
    this.successKey.set(null);
    this.productDialog().nativeElement.showModal();
  }

  protected openEditForm(product: ProductCatalogItem): void {
    if (!this.canEditProducts()) {
      this.errorKey.set('products.errors.forbidden');
      return;
    }

    this.editingProductId.set(product.id);
    this.productForm.reset({
      sku: product.sku,
      name: product.name,
      category: product.category,
      unit: product.unit,
      isActive: product.isActive ? 'active' : 'inactive',
    });
    this.errorKey.set(null);
    this.successKey.set(null);
    this.productDialog().nativeElement.showModal();
  }

  protected closeForm(): void {
    const dialog = this.productDialog().nativeElement;
    if (dialog.open) {
      dialog.close();
    }
    this.editingProductId.set(null);
    this.productForm.reset({ sku: '', name: '', category: '', unit: '', isActive: '' });
    this.errorKey.set(null);
  }

  protected resetAfterDialogClose(): void {
    this.editingProductId.set(null);
    this.productForm.reset({ sku: '', name: '', category: '', unit: '', isActive: '' });
    this.errorKey.set(null);
  }

  protected saveProduct(): void {
    const id = this.editingProductId();
    const allowed = id ? this.canEditProducts() : this.canCreateProducts();
    if (!allowed) {
      this.errorKey.set('products.errors.forbidden');
      return;
    }

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const value = this.productForm.getRawValue();
    const draft = {
      sku: value.sku,
      name: value.name,
      category: value.category,
      unit: value.unit,
      isActive: value.isActive === 'active',
    };

    try {
      if (id) {
        this.productCatalog.update(id, draft);
        this.successKey.set('products.updateSuccess');
      } else {
        this.productCatalog.add(draft);
        this.successKey.set('products.addSuccess');
      }
      this.products.set(this.productCatalog.getAll());
      this.closeForm();
    } catch (error: unknown) {
      this.handleCatalogError(error);
    }
  }

  protected fieldError(control: 'sku' | 'name' | 'category' | 'unit' | 'isActive'): string | null {
    const formControl = this.productForm.controls[control];
    return formControl.touched && formControl.invalid ? 'products.errors.required' : null;
  }

  protected editLabel(productName: string): string {
    return this.translate.instant('products.editNamed', { name: productName });
  }

  private handleCatalogError(error: unknown): void {
    if (!(error instanceof ProductCatalogError)) {
      this.errorKey.set('products.errors.generic');
      return;
    }

    switch (error.code) {
      case 'invalid-input':
        this.errorKey.set('products.errors.invalidInput');
        return;
      case 'not-found':
        this.errorKey.set('products.errors.notFound');
        return;
    }
  }
}
