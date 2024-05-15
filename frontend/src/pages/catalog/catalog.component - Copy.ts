import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { SidebarComponent } from '../../shared/ui/sidebar/sidebar.component';
import { ProductListComponent } from '../../features/product-list/product-list.component';
import { CartService, CartType, Product } from '../../shared/api';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  forkJoin,
  Observable,
  observeOn,
  of,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
} from 'rxjs';
import { SubtypeService } from '../../shared/api/subtypes';
import { ProductsService } from '../../shared/api/products/products.service';
import { EngRusTypes } from '../../shared/constants';
import { AsyncPipe, NgIf } from '@angular/common';
import { LoaderService } from '../../shared/services/loader.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [SidebarComponent, ProductListComponent, NgIf, AsyncPipe],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent implements OnInit, OnDestroy {
  types!: string;
  products: Product[] = [];
  productsSubscription!: Subscription | null;
  type: string = 'all';
  cartItems: CartType = {} as CartType;
  isOpen: boolean = true;
  isLoading: boolean = false;
  private unsubscribe$: Subject<void> = new Subject<void>();
  constructor(
    private loadService: LoaderService,
    private cartService: CartService,
    private ProductsService: ProductsService,
    private route: ActivatedRoute,
    private subTypesService: SubtypeService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
      this.productsSubscription = null;
      this.products = [];
      this.cd.detectChanges();
    }
  }
  ngOnInit() {
    this.products = [];
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: Params) => {
        this.type = params['type'];
        this.requestProducts();
      });
    this.cd.detectChanges();
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  requestProducts() {
    this.isLoading = true;
    this.cd.detectChanges();
    this.cartService
      .getCartItems('main')
      .pipe(
        catchError((error) => {
          // Обработка ошибки, например, логирование или возврат пустого массива
          console.error('Ошибка при получении элементов корзины:', error);
          return of({ products: [] }); // Возвращаем пустой массив, чтобы продолжить выполнение
        }),
        switchMap((cartItems) => {
          this.cartItems.products = cartItems.products;
          return this.route.params; // возвращаем параметры маршрута
        }),
        switchMap((params) => {
          this.type = params['type'];
          return this.subTypesService.getSubtypes(); // получаем подтипы
        }),
        switchMap((subTypes) => {
          const subTypeId = subTypes[EngRusTypes[this.type]];
          return this.ProductsService.getProducts({ subTypeId });
        })
      )
      .subscribe((products) => {
        this.products = products.map((product) => ({
          ...product,
          previewPhoto: product.variants[0].photos[0],
          inCart: this.cartItems.products.some(
            (cartItem) => cartItem === product._id
          ),
        }));
        console.log('this.isLoading = false');
        this.isLoading = false;
        setTimeout(() => this.cd.detectChanges(), 0);
      });
  }

  updateProducts(products: Product[]) {
    this.products = [...products];
    this.cd.detectChanges();
  }
}
