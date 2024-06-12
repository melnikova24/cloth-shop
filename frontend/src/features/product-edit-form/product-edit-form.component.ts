import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CategoriesService, ICategory, Product, VariantProduct} from "../../shared/api";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {QueryParamsService} from "../../shared/services/query-params.service";
import {ISubtype, SubtypeService} from "../../shared/api/subtypes";
import {ProductsService} from "../../shared/api/products/products.service";
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-product-edit-form',
  standalone: true,
  imports: [CommonModule, NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, ReactiveFormsModule],
  templateUrl: './product-edit-form.component.html',
  styleUrl: './product-edit-form.component.scss'
})
export class ProductEditFormComponent implements OnInit {
  //запрашиваемые
  categories!: ICategory[];
  subtypes!: string[][];

  @Input() product!: Product | null;
  selectedCategory!: ICategory | null;
  selectedSubtype: string[] = [];
  selectedImages!: FileList | null;
  imageUrls: string[][] = [];
  formGroupProduct!: FormGroup;

  @Output() getProducts = new EventEmitter<string>();
  editProductEmit(product: Product): void {
    this.getProducts.emit();
  }

  @Output() closeModal = new EventEmitter();
  closeModalEmit (): void {
    this.closeModal.emit();
  }

  constructor(private queryParamsService: QueryParamsService, private fb: FormBuilder, private categoryService: CategoriesService, private subTypeService: SubtypeService, private productService: ProductsService) {

  }

  ngOnInit() {
    // @ts-ignore
    this.selectedCategory = this.product.category;
    this.formGroupProduct = this.fb.group({
      _id: [this.product?._id || ''],
      categoryId: [this.selectedCategory?._id || '' ],
      subTypeId: [this.product?.subTypeId || ''],
      description: [this.product?.description || ''],
      name: [this.product?.name || '' , Validators.required],
      variants: this.fb.array(this.product?.variants.map(variant => this.fb.group({
        size: [variant.size],
        color: [variant.color],
        price: [variant.price],
        photos: [variant.photos]
      })) || [], Validators.required) // Initialize variants as FormArray
    });
    this.imageUrls = this.product?.variants.map((variant) => [...variant.photos]) || [];
    this.subTypeService.getSubtypes().subscribe(data => {
      this.subtypes = Object.entries(data);
      const subtype = Object.entries(data).find(subtype => subtype[1] === this.product?.subTypeId)
      if (subtype) {
        this.selectedSubtype = subtype
        this.categoryService.getCategories(subtype[1]).subscribe(categories => {
          this.categories = categories;
        })
      } else {
        this.selectedSubtype = []
      }
    });
  }



  submit() {
    console.log(this.formGroupProduct.value, this.selectedSubtype, this.selectedCategory, this.formGroupProduct)
    if (
      !this.formGroupProduct || this.formGroupProduct.invalid
      || !this.selectedCategory || !this.selectedSubtype
    ) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    this.formGroupProduct.value.variants.forEach((variant: VariantProduct, index: number) => {
      if (variant.photos.length === 0) {
        alert('Пожалуйста, заполните все обязательные поля');
        return
      }
    })

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
    this.productService.patchProduct(product).subscribe({
      next: (data) => {
        this.editProductEmit(data)
        this.formGroupProduct.reset();
        // this.imageUrls = [];
        this.formGroupProduct.controls['variants'].reset();
        this.closeModalEmit()
      },
      error: err => {
        alert("Произошла ошибка")
      }
    })
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

  get variants() {
    return this.formGroupProduct.get('variants') as FormArray;
  }

  variantValues(index: number, key: string) {
    return this.variants.value[index][key]
  }

  removeVariant(index: number) {
    this.variants.removeAt(index);
  }

  newVariant(): FormGroup {
    return this.fb.group({
      size: ['', Validators.required],
      color: ['', Validators.required],
      price: ['', Validators.required],
      photos: ['']
    });
  }

  onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files && inputElement.files.length > 0) {
      this.selectedImages = inputElement.files;
    }
  }

  addVariant() {
    this.variants.push(this.newVariant());
  }

  upload(index: number): void {
    if (this.selectedImages) {
      this.uploadFiles(this.selectedImages, index);
      this.selectedImages = null;
    }
  }

  removePhoto(index: number, photoIndex: number) {
    this.imageUrls[index].splice(photoIndex, 1);
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
}
