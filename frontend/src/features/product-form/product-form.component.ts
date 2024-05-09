import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbDropdown, NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";
import {AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CategoriesService, ICategory, Product} from "../../shared/api";
import {Observable} from "rxjs";
import {SubtypeService} from "../../shared/api/subtypes";
import {ProductsService} from "../../shared/api/products/products.service";
import {QueryParamsService} from "../../shared/services/query-params.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  categories!: ICategory[];
  subtypes!: string[][];
  selectedCategory!: ICategory | null;
  selectedSubtype: string[] = [];
  types!: Record<string, string>[];
  selectedImages!: FileList | null;
  imageUrls: string[][] = [];
  formGroupProduct!: FormGroup;

  @Output() getProducts = new EventEmitter<string>();

  AddProductEmit(product: Product): void {
    this.getProducts.emit();
  }


  onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files && inputElement.files.length > 0) {
      this.selectedImages = inputElement.files;
    }
  }

  upload(index: number): void {
    if (this.selectedImages) {
      this.uploadFiles(this.selectedImages, index);
      this.selectedImages = null;
    }
  }

  private uploadFiles(images: FileList, index: number): void {
    let base64String:string[] = [];
    for (let index = 0; index < images.length; index++) {
      const element = images[index];
      let reader = new FileReader();
      reader.onload = () => {
        // @ts-ignore
        base64String.push("data:image/jpeg;base64," + reader?.result?.replace("data:", "")
          .replace(/^.+,/, ""));
      }
      reader.readAsDataURL(element);
    }
    this.imageUrls[index] = base64String;
  }

  constructor( private fb: FormBuilder, private categoryService: CategoriesService, private subTypeService: SubtypeService, private productService: ProductsService) {

  }

  changeType(subType: string[]) {
    this.selectedSubtype = subType;
    this.selectedCategory = null;
    this.categories = [];
    this.categoryService.getCategories(subType[1]).subscribe(categories => {
      this.categories = categories;
    })
  }

  changeCategory(category: ICategory) {
    this.selectedCategory = category;
  }


  ngOnInit() {
    this.formGroupProduct = this.fb.group({
      categoryId: [''],
      subTypeId: [''],
      description: [''],
      name: [''],
      variants: this.fb.array([]) // Initialize variants as FormArray
    });
    this.subTypeService.getSubtypes().subscribe(data => {
      this.subtypes = Object.entries(data);
    }, );
  }

  // Function to add a new variant
  addVariant() {
    this.variants.push(this.newVariant());
  }


  newVariant(): FormGroup {
    return this.fb.group({
      size: [''],
      color: [''],
      price: [''],
      photos: ['']
    });
  }

  submit() {
    const productVariants = this.formGroupProduct.value.variants.map((variant: any, index: number) => ({
      ...variant,
      photos: this.imageUrls[index]
    }));
    const product = {
      ...this.formGroupProduct.value,
      variants: productVariants,
      categoryId: this.selectedCategory?._id,
      subTypeId: this.selectedSubtype[1],
    }
    this.productService.postProduct(product).subscribe({
      next: (data) => {
        alert('Успешно')
        this.AddProductEmit(data)
      },
      error: err => {
        alert("Произошла ошибка")
      }
    })
  }

  removeVariant(index: number) {
    this.variants.removeAt(index);
  }

  removePhoto(index: number, photoIndex: number) {
    this.imageUrls[index].splice(photoIndex, 1);
  }

  get variants() {
    return this.formGroupProduct.get('variants') as FormArray;
  }
}