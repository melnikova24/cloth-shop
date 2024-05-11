import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';

import {CheckboxComponent} from "../../../components/checkbox/checkbox.component";
import {ProductsService} from "../../api/products/products.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ISubtype, SubtypeService} from "../../api/subtypes";
import { ActivatedRoute } from '@angular/router';
import {CATEGORIES, COLORS, EngRusTypes, SIZES} from "../../constants";
import {CategoriesService, ICategory, Product} from "../../api";
import {NgForOf, NgIf} from "@angular/common";
import {OnlyNumberDirective} from "../../directives/onlyNumber.directive";
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle
} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CheckboxComponent, FormsModule, ReactiveFormsModule, NgForOf, OnlyNumberDirective, NgIf, NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  @ViewChildren(CheckboxComponent) checkboxes!: QueryList<CheckboxComponent>
  subTypes!: Record<string, string>;
  type!: string;
  filtersForm!: FormGroup;
  filters: any = {
    sizes: '',
    colors: '',
    categoryId: '',
    minPrice: 0,
    maxPrice: 99999
  };


  categories!: ICategory[];
  sizes: string[] = SIZES;
  colors: string[] = COLORS;



  @Output() updateProducts = new EventEmitter<Product[]>();
  updateProductsHandler(products: Product[]) {
    this.updateProducts.emit(products)
  }

  constructor(private cd: ChangeDetectorRef, private productsService: ProductsService, private subtypesService: SubtypeService, private route: ActivatedRoute, private categoriesService: CategoriesService) {

  }

  ngOnInit() {
    this.requestProducts()
  }

  getCategoryName() {
    return this.filtersForm.get('categoryId')?.value.name
  }

  requestProducts() {
    this.filtersForm = new FormGroup({
      'sizes': new FormControl(''),
      'colors': new FormControl(''),
      'minPrice': new FormControl(0),
      'maxPrice': new FormControl(99999),
      'categoryId': new FormControl(''),
    })
    // this.type = this.route.snapshot.paramMap.get('type') || '';
    this.route.params.subscribe(params => {
      this.type = params['type'];
      this.subtypesService.getSubtypes().subscribe({
        next: data => {
          this.subTypes = data
          this.categoriesService.getCategories(data[EngRusTypes[this.type]]).subscribe({
            next: data => {
              this.categories = data
              this.cd.detectChanges()
            },
            error: err => {
              console.log(err)
            }
          })
          // console.log(EngRusTypes[this.type], this.subTypes)
          // @ts-ignore
          this.productsService.getProductFilters(data[EngRusTypes[this.type]]).subscribe({
            next: data => {
              this.filters = data
              this.cd.detectChanges()
            },
            error: err => {
              console.log(err)
            }
          })
        },
        error: err => {
          console.log(err)
        }
      })
      this.cd.detectChanges()
    });
  }

  submitFilters() {
    this.productsService.getProducts({
      ...this.filtersForm.value,
      categoryId: this.filtersForm.get('categoryId')?.value?._id || 'null'
    }).subscribe(data => {
      this.updateProductsHandler(data.map(product => ({
        ...product,
        previewPhoto: product.variants[0].photos[0]
      })))
    })
  }

  selectCategory(categoryId: ICategory) {
    this.filtersForm.get('categoryId')?.setValue(categoryId)
  }

  selectColor(colors: string) {
    this.filtersForm.get('colors')?.setValue(colors)
  }

  selectSize(size: string) {
    this.filtersForm.get('sizes')?.setValue(size)
  }

  clearFilters() {
    this.filtersForm.controls['minPrice'].setValue(0)
    this.filtersForm.controls['maxPrice'].setValue(99990)
    this.filtersForm.controls['sizes'].setValue('')
    this.filtersForm.controls['colors'].setValue('')
    this.filtersForm.controls['categoryId'].setValue('')
    this.requestProducts()
  }

  disableCheckboxes(value: string, groupName: string) {
    if (this.checkboxes) {
      this.checkboxes.map(checkbox => {
        const isThisGroup = checkbox.groupName === groupName;
        const isThisValue = checkbox.value === value;
        if (isThisGroup) {
          isThisValue ? checkbox.isChecked = true : checkbox.isChecked = false
        }
      })
    }
  }
}
