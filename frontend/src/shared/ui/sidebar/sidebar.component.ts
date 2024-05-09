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
import {NgForOf} from "@angular/common";


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CheckboxComponent, FormsModule, ReactiveFormsModule, NgForOf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  @ViewChildren(CheckboxComponent) checkboxes!: QueryList<CheckboxComponent>
  subTypes!: Record<string, string>;
  type!: string;
  filtersForm!: FormGroup;
  filters: any = {
    sizes: [],
    colors: [],
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
    this.filtersForm = new FormGroup({
      'sizes': new FormControl([]),
      'colors': new FormControl([]),
      'minPrice': new FormControl(0),
      'maxPrice': new FormControl(99999),
      'categoryId': new FormControl(''),
    })
    this.type = this.route.snapshot.paramMap.get('type') || '';
    this.subtypesService.getSubtypes().subscribe({
      next: data => {
        this.subTypes = data
        this.categoriesService.getCategories(data[EngRusTypes[this.type]]).subscribe({
          next: data => {
            this.categories = data
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
  }

  removeLeadingZeros() {
    console.log(this.filtersForm.controls['minPrice'].value)
    let minValue = this.filtersForm.controls['minPrice'].value;
    let maxValue = this.filtersForm.controls['maxPrice'].value;
    // Удаляем ведущие нули с помощью регулярного выражения

    minValue = String(minValue).replace(/^0+/, '');
    maxValue = String(maxValue).replace(/^0+/, '');
    // Обновляем значение формы без ведущих нулей
    this.filtersForm.controls['minPrice'].setValue(minValue, { emitEvent: false });
    this.filtersForm.controls['maxPrice'].setValue(maxValue, { emitEvent: false });
  }

  submitFilters() {
    this.productsService.getProducts(this.filtersForm.value).subscribe(data => {
      this.updateProductsHandler(data.map(product => ({
        ...product,
        previewPhoto: product.variants[0].photos[0]
      })))
    })
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
