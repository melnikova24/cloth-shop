import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

import {ActivatedRoute, Params} from "@angular/router";
import {SidebarComponent} from "../../shared/ui/sidebar/sidebar.component";
import {ProductListComponent} from "../../features/product-list/product-list.component";
import {CartService, CartType, Product} from "../../shared/api";
import {
  BehaviorSubject,
  catchError, distinctUntilChanged,
  forkJoin,
  Observable,
  observeOn,
  of,
  Subject,
  Subscription,
  switchMap,
  takeUntil
} from "rxjs";
import {SubtypeService} from "../../shared/api/subtypes";
import {ProductsService} from "../../shared/api/products/products.service";
import {EngRusTypes} from "../../shared/constants";
import {AsyncPipe, NgIf} from "@angular/common";
import {LoaderService} from "../../shared/services/loader.service";

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [SidebarComponent, ProductListComponent, NgIf, AsyncPipe],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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

  constructor(private loadService: LoaderService, private cartService: CartService, private ProductsService: ProductsService, private route: ActivatedRoute, private subTypesService: SubtypeService, private cd: ChangeDetectorRef) {}

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
    // Reset products array on initialization
    this.products = [];

    // Subscribe to route params changes and fetch products only when the 'type' param changes
    this.route.params.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((params: Params) => {
      const newType = params['type'];
      if (this.type !== newType) {
        this.type = newType;
        this.requestProducts();
      }
    });

    // Detect changes after initializing
    this.cd.detectChanges();
  }

  toggleSidebar() {
    // Toggle the sidebar's open/close state
    this.isOpen = !this.isOpen;
  }

  requestProducts() {
    // Set loading state to true before fetching products
    this.isLoading = true;
    this.cd.detectChanges();

    // Fetch cart items and related products
    this.cartService.getCartItems('main').pipe(
      catchError(error => {
        console.error('Error while fetching cart items:', error);
        return of({ products: [] });
      }),
      switchMap(cartItems => {
        this.cartItems.products = cartItems.products;
        return this.subTypesService.getSubtypes();
      }),
      switchMap(subTypes => {
        const subTypeId = subTypes[EngRusTypes[this.type]];
        return this.ProductsService.getProducts({ subTypeId });
      })
    ).subscribe((products) => {
      // Map products and update inCart status
      this.isLoading = false;
      this.products = products.map(product => ({
        ...product,
        previewPhoto: product.variants[0].photos[0],
        inCart: this.cartItems.products.some(cartItem => cartItem === product._id)
      }));
      // Update products array and detect changes
      this.cd.detectChanges();
    });
  }

  updateProducts(products: Product[]) {
    // Update products array and detect changes
    this.products = [...products];
    this.cd.detectChanges();
  }
}
