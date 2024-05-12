import {Component, OnInit} from '@angular/core';
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import {RouterLink} from "@angular/router";
import {NgClass, NgForOf, NgOptimizedImage} from "@angular/common";
import {CartService, CartType, Product} from "../../shared/api";
import {ProductsService} from "../../shared/api/products/products.service";
import {FavoritesService} from "../../shared/services/favorites.service";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NgbCarouselModule, RouterLink, NgOptimizedImage, NgForOf, NgClass],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  images = [1, 2, 3].map((n) => `/assets/slides/slide-${n}.png`);
  cartItems: CartType = {} as CartType;
  latestProducts: Product[] = [];
  constructor(private cartService: CartService, private productService: ProductsService, private favoritesService: FavoritesService) {
  }

  addToFavorite(product: Product) {
    this.favoritesService.addFavorite(product)
    this.requestProducts()
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
  ngOnInit() {
    this.requestProducts()
  }

  requestProducts() {
    this.productService.getLatestProducts().subscribe(products => {
      const productList = products.map((product) => {
        return {...product, previewPhoto: product.variants[0].photos[0], inFavorites: this.favoritesService.inFavorites(product)}
      })
      this.latestProducts = productList
      try {
        this.cartService.getCartItems('main').subscribe(cartItems => {
          this.cartItems.products = cartItems.products
          this.latestProducts = productList.map(item => {
            return {...item, inCart: this.cartItems.products.some(cartItem => cartItem === item._id)}
          })
        })
      } catch (e) {
        console.log(e)
      }
    })
  }
}
