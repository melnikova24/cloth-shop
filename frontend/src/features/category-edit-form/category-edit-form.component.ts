import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CategoriesService, ICategory, Product} from "../../shared/api";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {QueryParamsService} from "../../shared/services/query-params.service";
import {SubtypeService} from "../../shared/api/subtypes";
import {ProductsService} from "../../shared/api/products/products.service";
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-category-edit-form',
  standalone: true,
  imports: [CommonModule, NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, ReactiveFormsModule],
  templateUrl: './category-edit-form.component.html',
  styleUrl: './category-edit-form.component.scss'
})
export class CategoryEditFormComponent implements OnInit {
  subtypes!: string[][];
  selectedSubtype: string[] = [];
  types!: Record<string, string>[];
  formGroup1!: FormGroup;

  @Input() selectedCategory!: ICategory | null;
  @Output() getCategories = new EventEmitter<string>();
  AddCategoryEmit(category: ICategory): void {
    this.getCategories.emit();
  }

  @Output() closeModal = new EventEmitter();
  closeModalEmit (): void {
    this.closeModal.emit();
  }

  constructor(private fb: FormBuilder, private categoryService: CategoriesService, private subTypeService: SubtypeService) {

  }

  ngOnInit() {
    this.formGroup1 = this.fb.group({
      description: [this.selectedCategory?.description || ''],
      name: [this.selectedCategory?.name || ''],
      subTypeId: [[this.selectedCategory?.subType?.name, this.selectedCategory?.subTypeId] || ''],
    });
    // @ts-ignore
    this.selectedSubtype = [this.selectedCategory?.subType?.name, this.selectedCategory?.subTypeId]
    this.subTypeService.getSubtypes().subscribe(data => {
      this.subtypes = Object.entries(data);
    });
  }

  changeType(subType: string[]) {
    this.selectedSubtype = subType;
  }

  submit() {
    const category = {
      ...this.selectedCategory,
      ...this.formGroup1.value,
      subTypeId: this.selectedSubtype[1]
    }
    // @ts-ignore
    this.categoryService.patchCategory(category).subscribe({
      next: (data) => {
        this.AddCategoryEmit(data)
        this.closeModal.emit()
        this.closeModalEmit()
      },
      error: err => {
        alert("Произошла ошибка")
      }
    })

  }
}
