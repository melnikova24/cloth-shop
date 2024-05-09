import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CategoriesService, ICategory, Product} from "../../shared/api";
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
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit {
  subtypes!: string[][];
  selectedSubtype: string[] = [];
  types!: Record<string, string>[];

  formGroup!: FormGroup;

  @Output() getCategories = new EventEmitter<string>();
  AddCategoryEmit(category: ICategory): void {
    this.getCategories.emit();
  }

  constructor( private fb: FormBuilder, private categoryService: CategoriesService, private subTypeService: SubtypeService) {

  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      description: [''],
      name: [''],
      subTypeId: [''],
    });
    this.subTypeService.getSubtypes().subscribe(data => {
      this.subtypes = Object.entries(data);
    });
  }

  changeType(subType: string[]) {
    this.selectedSubtype = subType;
  }

  submit() {
    const category = {
      ...this.formGroup.value,
      subTypeId: this.selectedSubtype[1]
    }
    this.categoryService.postCategory(category).subscribe({
      next: (data) => {
        this.AddCategoryEmit(data)
      },
      error: err => {
        alert("Произошла ошибка")
      }
    })
  }
}
