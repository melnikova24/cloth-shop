import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {ActivatedRoute} from "@angular/router";
import {SidebarComponent} from "../../shared/ui/sidebar/sidebar.component";
import {ProductListComponent} from "../../features/product-list/product-list.component";
import {CartService, CartType, Product} from "../../shared/api";
import {catchError, forkJoin, of, Subscription, switchMap} from "rxjs";
import {SubtypeService} from "../../shared/api/subtypes";
import {ProductsService} from "../../shared/api/products/products.service";
import {EngRusTypes} from "../../shared/constants";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [SidebarComponent, ProductListComponent, NgIf],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent implements OnInit {
  types!: string;
  products: Product[] = [];
  productsSubscription!:  Subscription;
  type: string = 'all';
  cartItems: CartType = {} as CartType;
  isOpen: boolean = true
  constructor(private cartService: CartService, private ProductsService: ProductsService, private route: ActivatedRoute, private subTypesService: SubtypeService, private cd: ChangeDetectorRef) {

  }
  ngOnInit() {
    this.requestProducts()
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen
  }

  requestProducts() {
    try {
      this.cartService.getCartItems('main').pipe(
        catchError(error => {
          // Обработка ошибки, например, логирование или возврат пустого массива
          console.error('Ошибка при получении элементов корзины:', error);
          return of({ products: [] }); // Возвращаем пустой массив, чтобы продолжить выполнение
        }),
        switchMap(cartItems => {
          this.cartItems.products = cartItems.products;
          return this.route.params; // возвращаем параметры маршрута
        }),
        switchMap(params => {
          this.type = params['type'];
          return this.subTypesService.getSubtypes(); // получаем подтипы
        }),
        switchMap(subTypes => {
          const subTypeId = subTypes[EngRusTypes[this.type]];
          const products = this.ProductsService.getProducts({ subTypeId });
          return forkJoin({ products: products, subTypes: of(subTypes) });
        })
      ).subscribe(({ products, subTypes }) => {
        this.products = products.map(product => ({
          ...product,
          previewPhoto: product.variants[0].photos[0],
          inCart: this.cartItems.products.some(cartItem => cartItem === product._id)
        }));
        this.cd.detectChanges();
      });
      // this.cartService.getCartItems('main').subscribe(cartItems => {
      //   this.cartItems.products = cartItems.products
      //   this.route.params.subscribe(params => {
      //     this.subTypesService.getSubtypes().subscribe(subTypes => {
      //       this.type = params['type'];
      //       this.productsSubscription = this.ProductsService.getProducts({subTypeId: subTypes[EngRusTypes[this.type]]}).subscribe((products) => {
      //         this.products = products.map((product) => {
      //           return {...product, previewPhoto: product.variants[0].photos[0], inCart: cartItems.products.some(cartItem => cartItem === product._id)}
      //         })
      //         this.cd.detectChanges()
      //       })
      //     })
      //   })
      // })
    } catch (e) {
      console.log(e)
    }

  }

  updateProducts(products: Product[]) {
    this.products = [...products]
    this.cd.detectChanges()
  }
}
