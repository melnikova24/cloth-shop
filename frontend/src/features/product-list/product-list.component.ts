import {Component, OnInit} from '@angular/core';

import {Product} from "../../shared/api";
import {Subscription} from "rxjs";
import {ProductsService} from "../../shared/api/products/products.service";
import {NgForOf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {EngRusTypes} from "../../shared/constants";
import {SubtypeService} from "../../shared/api/subtypes";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  productsSubscription!:  Subscription;
  type: string = 'all';
  constructor(private ProductsService: ProductsService, private route: ActivatedRoute, private subTypesService: SubtypeService) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.subTypesService.getSubtypes().subscribe(subTypes => {
        this.type = params['type'];
        this.productsSubscription = this.ProductsService.getProducts({subTypeId: subTypes[EngRusTypes[this.type]]}).subscribe((products) => {
          this.products = products.map((product) => {
            return {...product, previewPhoto: product.variants[0].photos[0]}
          })
        })
      })
    })
  }

  ngOnDestroy() {
    if (this.productsSubscription) this.productsSubscription.unsubscribe();
  }
}
