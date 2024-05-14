import {ChangeDetectorRef, Component, inject, OnInit, TemplateRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle, NgbModal
} from "@ng-bootstrap/ng-bootstrap";
import {ProductEditFormComponent} from "../../../../features/product-edit-form/product-edit-form.component";
import {ProductFormComponent} from "../../../../features/product-form/product-form.component";
import {Subscription} from "rxjs";
import {CategoriesService, ICategory, Product} from "../../../../shared/api";
import {CategoryFormComponent} from "../../../../features/category-form/category-form.component";
import {CategoryEditFormComponent} from "../../../../features/category-edit-form/category-edit-form.component";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, ProductEditFormComponent, ProductFormComponent, CategoryFormComponent, CategoryEditFormComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  selectedCategory!: ICategory | null;
  categories!: ICategory[];
  subscription!: Subscription;

  private modalService = inject(NgbModal);
  closeResult = ''
  constructor(private categoriesService: CategoriesService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCategories()
  }

  open(content: TemplateRef<any>, category?: ICategory) {
    if (category) {
      this.selectedCategory = category;
    }
    this.modalService.open(content).result.then();
  }

  deleteCategory(category: ICategory) {
    this.categoriesService.deleteCategory(category._id).subscribe(() => {
      this.categories = this.categories.filter(p => p._id !== category._id);
      this.cd.detectChanges()
    })
  }

  getCategories() {
    this.subscription = this.categoriesService
      .getCategories('all')
      .subscribe(
        categories => {
          this.categories = categories
          this.cd.detectChanges()
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
