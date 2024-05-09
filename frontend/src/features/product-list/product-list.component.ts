import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

import {CartService, CartType, Product} from "../../shared/api";
import {NgClass, NgForOf} from "@angular/common";
import {ProductsService} from "../../shared/api/products/products.service";
import {FavoritesService} from "../../shared/services/favorites.service";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    NgForOf,
    NgClass
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit  {
  @Input() products: Product[] = [];
  cartItems: CartType = {} as CartType;

  constructor(private cartService: CartService, private favoritesService: FavoritesService) {

  }

  ngOnInit() {
    try {
      this.cartService.getCartItems('main').subscribe(cartItems => {
        this.cartItems.products = cartItems.products
      })
    } catch (e) {
      console.log(e)
    }
  }

  inCart(product: Product) {
    return this.cartItems.products.some(cartItem => cartItem === product._id)
  }

  addToFavorite(product: Product) {
    this.favoritesService.addFavorite(product)
  }


  addToCart(product: Product) {
    const filtered = this.cartItems.products.filter(item => item !== product._id)
    if (filtered.length === this.cartItems.products.length) {
      this.cartService.editCart([...this.cartItems.products, product._id]).subscribe(cartItems => {
        this.cartItems.products = cartItems.products
      })
    } else {
      this.cartService.editCart([...filtered]).subscribe(cartItems => {
        this.cartItems.products = cartItems.products
      })
    }

  }

  isFavorite(product: Product) {
    return this.favoritesService.inFavorites(product)
  }

}
