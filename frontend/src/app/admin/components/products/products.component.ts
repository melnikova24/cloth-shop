import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnChanges, OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {SIZES} from "../../../../shared/constants";
import {
  ModalDismissReasons,
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle, NgbModal
} from "@ng-bootstrap/ng-bootstrap";
import {Observable, Subscription} from "rxjs";
import {CategoriesService, ICategory, Product} from "../../../../shared/api";
import {ProductFormComponent} from "../../../../features/product-form/product-form.component";
import {ProductEditFormComponent} from "../../../../features/product-edit-form/product-edit-form.component";
import {ProductsService} from "../../../../shared/api/products/products.service";
import {QueryParamsService} from "../../../../shared/services/query-params.service";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, ProductFormComponent, ProductEditFormComponent, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit, OnDestroy  {
  categories!: Observable<ICategory[]>;
  sizes: string[] = SIZES;
  colors!: string[];
  selectedProduct!: Product | null;
  products!: Product[];
  subscription!: Subscription;
  filterForm!: FormGroup;

  constructor(private fb: FormBuilder, private categoriesService: CategoriesService, private productService: ProductsService, private queryParamsService: QueryParamsService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.getProducts()
    this.filterForm = this.fb.group({
      name: [''],
      colors: [''],
      sizes: [''],
      categoryId: [''],
    });
    this.categories = this.categoriesService.getCategories('all');
    this.cd.detectChanges()
  }

  clear() {
    this.filterForm.reset();
    this.getProducts()
  }

  selectCategory(categoryId: ICategory) {
    this.filterForm.get('categoryId')?.setValue(categoryId)
  }

  selectColor(colors: string) {
    this.filterForm.get('colors')?.setValue(colors)
  }

  selectSize(size: string) {
    this.filterForm.get('sizes')?.setValue(size)
  }

  get form() {
    return this.filterForm.controls
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getProducts() {
    this.queryParamsService.getQueryParams().subscribe(query => {
      this.subscription = this.productService
        .getProducts(query)
        .subscribe(
          products => {
            this.products = products
            this.cd.detectChanges()
          }
        );
    })
    this.productService.getProductFilters('all').subscribe(filters => {
      this.colors = filters['colors']
      this.sizes = filters['sizes']
      this.cd.detectChanges()
    })
  }

  private modalService = inject(NgbModal);
  closeResult = ''


  open(content: TemplateRef<any>, product?: Product) {
    if (product) {
      this.selectedProduct = product;
    }

    this.modalService.open(content).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  deleteProduct(product: Product) {
    this.productService.deleteProduct(product._id).subscribe(() => {
      this.products = this.products.filter(p => p._id !== product._id);
      this.cd.detectChanges()
    })
  }

  submit() {
    const filters = {
      ...this.filterForm.value,
      categoryId: this.filterForm.get('categoryId')?.value?._id || 'null'
    }
    this.productService.getProducts(filters).subscribe(products => {
      this.products = products
      this.cd.detectChanges()
    })
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
}
