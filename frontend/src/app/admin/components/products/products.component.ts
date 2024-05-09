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

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, ProductFormComponent, ProductEditFormComponent],
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

  constructor(private categoriesService: CategoriesService, private productService: ProductsService, private queryParamsService: QueryParamsService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.getProducts()
    this.cd.detectChanges()
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
