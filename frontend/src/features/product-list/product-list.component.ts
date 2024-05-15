import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';

import {CartService, CartType, Product} from "../../shared/api";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ProductsService} from "../../shared/api/products/products.service";
import {FavoritesService} from "../../shared/services/favorites.service";
import {RouterLink} from "@angular/router";
import {LoaderService} from "../../shared/services/loader.service";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    RouterLink,
    NgIf
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent  {
  @Input() products: Product[] = [];
  @Input() cartItems: CartType = {} as CartType;
  @Input() isLoading: boolean = false


  constructor(private cartService: CartService, private favoritesService: FavoritesService, private cd: ChangeDetectorRef, private loaderService: LoaderService) {

  }


  addToFavorite(product: Product) {
    this.favoritesService.addFavorite(product)
  }


  addToCart(product: Product) {
    const filtered = this.cartItems.products.filter(item => item !== product._id)
    if (filtered.length === this.cartItems.products.length) {
      this.cartService.editCart([...this.cartItems.products, product._id]).subscribe(cartItems => {
        this.cartItems = {...cartItems, products: [...this.cartItems.products, product._id]}
      })
    } else {
      this.cartService.editCart([...filtered]).subscribe(cartItems => {
        this.cartItems = {...cartItems, products: [...cartItems.products]}
      })
    }
    this.products = this.products.map(p => p._id === product._id ? {...p, inCart: !p.inCart} : p)
    this.cd.detectChanges()
  }

  isFavorite(product: Product) {
    return this.favoritesService.inFavorites(product)
  }

}
