import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {ActivatedRoute} from "@angular/router";
import {SidebarComponent} from "../../shared/ui/sidebar/sidebar.component";
import {ProductListComponent} from "../../features/product-list/product-list.component";
import {Product} from "../../shared/api";
import {Subscription} from "rxjs";
import {SubtypeService} from "../../shared/api/subtypes";
import {ProductsService} from "../../shared/api/products/products.service";
import {EngRusTypes} from "../../shared/constants";

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [SidebarComponent, ProductListComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent implements OnInit {
  types!: string;
  products: Product[] = [];
  productsSubscription!:  Subscription;
  type: string = 'all';
  constructor(private ProductsService: ProductsService, private route: ActivatedRoute, private subTypesService: SubtypeService, private cd: ChangeDetectorRef) {

  }
  ngOnInit() {
    this.requestProducts()
  }

  requestProducts() {
    this.route.params.subscribe(params => {
      this.subTypesService.getSubtypes().subscribe(subTypes => {
        this.type = params['type'];
        this.productsSubscription = this.ProductsService.getProducts({subTypeId: subTypes[EngRusTypes[this.type]]}).subscribe((products) => {
          this.products = products.map((product) => {
            return {...product, previewPhoto: product.variants[0].photos[0]}
          })
          this.cd.detectChanges()
        })
      })
    })
  }

  updateProducts(products: Product[]) {
    this.products = [...products]
    this.cd.detectChanges()
  }
}
