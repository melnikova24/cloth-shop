import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavComponent} from "../nav/nav.component";
import {NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";
import {CategoriesService, ICategory} from "../../../../shared/api";
import {Observable} from "rxjs";
import {SIZES} from "../../../../shared/constants";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavComponent, NgbDropdownModule, RouterOutlet],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  categories!: Observable<ICategory[]>;
  sizes: string[] = SIZES;
  colors!: string[];

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
    // this.categories = this.categoriesService.getCategories();
  }
}
