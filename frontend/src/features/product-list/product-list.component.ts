import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

import {Product} from "../../shared/api";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit  {
  @Input() products: Product[] = [];

  constructor() {

  }

  ngOnInit() {

  }

}
