import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CartService, CartType, OrdersService, Product} from "../../shared/api";
import {ProductsService} from "../../shared/api/products/products.service";
import {FavoritesService} from "../../shared/services/favorites.service";
import {LoaderService} from "../../shared/services/loader.service";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {
  products!: Product[];
  cartItems: CartType = {} as CartType;
  constructor(private cartService: CartService, private productService: ProductsService, public loaderService: LoaderService, private orderService: OrdersService) {
  }

  ngOnInit() {
    this.requestProducts()
  }

  ngOnDestroy() {
  }

  getCartCount() : number {
    return this.cartItems?.products?.length | 0
  }

  getCartSum() : number {
    try {
      // @ts-ignore
      // return this.cartItems.products.reduce((acc, item) => acc + this.products.find(product => product._id === item)?.variants[0]?.price || 0, 0)
      return this.cartItems.productsList.reduce((acc, item) => acc + item.selectedVariant.price || 0, 0)
    } catch (e) {
      return 0
    }
  }

  clearCart() {
    this.cartService.editCart([], []).subscribe(cartItems => {
      this.cartItems.products = cartItems.products
      this.cartItems.productsList = []
      this.products = []
    })
  }

  requestProducts() {
    this.productService.getLatestProducts().subscribe(products => {
      const productList = products.map((product) => {
        return {...product, previewPhoto: product.variants[0].photos[0]}
      })

      try {
        this.cartService.getCartItems('').subscribe(cartItems => {
          this.cartItems.products = cartItems.products
          this.cartItems.productsList = cartItems.productsList
          this.products = productList.filter(item => {
            if (this.cartItems.products.some(cartItem => cartItem === item._id)) {
              return true
            }
            return false
          })
        })
      } catch (e) {
        console.log(e, 'error')
      }
    })
  }

  addToCart(product: Product) {
    const filtered = this.cartItems.products.filter(item => item !== product._id)
    this.products = this.products.filter(item => item._id !== product._id)
    if (filtered.length === this.cartItems.products.length) {
      // @ts-ignore
      this.cartService.editCart([...this.cartItems.products, product._id], [...this.cartItems?.productsList, product]).subscribe(cartItems => {
        this.cartItems.products = cartItems.products
      })
    } else {
      // @ts-ignore
      this.cartService.editCart([...filtered], [...this.cartItems?.productsList.filter(item => item._id !== product._id), product]).subscribe(cartItems => {
        this.cartItems.products = cartItems.products

      })
    }

  }

  submit() {
    const order = {
      sumOfCart: this.getCartSum(),
      products: this.cartItems.productsList,
    }
    this.orderService.createOrder(order).subscribe(() => {
      this.clearCart()
    })
  }
}
