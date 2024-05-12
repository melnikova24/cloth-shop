import {Component, inject, OnInit, TemplateRef} from '@angular/core';
import {NgbCarousel, NgbModal, NgbSlide} from "@ng-bootstrap/ng-bootstrap";
import {CartService, CartType, Product, VariantProduct} from "../../shared/api";
import {ProductsService} from "../../shared/api/products/products.service";
import {ActivatedRoute} from "@angular/router";
import {ProductListComponent} from "../../features/product-list/product-list.component";
import {SidebarComponent} from "../../shared/ui/sidebar/sidebar.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ProductEditFormComponent} from "../../features/product-edit-form/product-edit-form.component";
import {FavoritesService} from "../../shared/services/favorites.service";


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    NgbCarousel,
    NgbSlide,
    ProductListComponent,
    SidebarComponent,
    NgIf,
    NgForOf,
    ProductEditFormComponent,
    NgClass
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  product!: Product;
  colors!: string[]
  sizes!: string[]
  cartItems: CartType = {} as CartType;

  selectedVariant!: VariantProduct;
  selectedPhoto!: string | null;
  selectedColor!: string | null;
  selectedSize!: string | null;

  constructor(private productService: ProductsService, private route: ActivatedRoute, private cartService: CartService, private favoritesService: FavoritesService) {
  }
  private modalService = inject(NgbModal);
  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.cartService.getCartItems('').subscribe(cartItems => {
      this.productService.getProduct(id).subscribe(data => {
        this.cartItems = cartItems
        this.product = {...data, inCart: cartItems.products.includes(data._id), inFavorite: this.favoritesService.inFavorites(data)}
        this.selectedVariant = data.variants[0]
        this.colors = [...new Set(data.variants.map(variant => variant.color))]
        this.sizes = [...new Set(data.variants.map(variant => variant.size))]
        this.selectedColor = this.colors[0]
      });
    })
  }

  open(content: TemplateRef<any>, photo: string) {
    this.selectedPhoto = photo
    this.modalService.open(content)
  }

  addToFavorite(product: Product) {
    this.favoritesService.addFavorite(product)
    this.product = {...this.product, inFavorite: this.favoritesService.inFavorites(product)}
  }

  addToCart(product: Product) {
    const filtered = this.cartItems.products.filter(item => item !== product._id)
    if (filtered.length === this.cartItems.products.length) {
      this.cartService.editCart([...this.cartItems.products, product._id]).subscribe(cartItems => {
        this.cartItems = {...cartItems, products: [...this.cartItems.products, product._id]}
        this.product = {...this.product, inCart: true}
      })
    } else {
      this.cartService.editCart([...filtered]).subscribe(cartItems => {
        this.cartItems = {...cartItems, products: [...cartItems.products]}
        this.product = {...this.product, inCart: false}
      })
    }
  }

  selectColor(color: string) {
    this.selectedColor = color
    this.selectedVariant = this.product.variants.find(variant => variant.color === color)!
    this.selectedSize = null
  }

  selectSize(size: string) {
    this.selectedSize = size
    const isThereElem = this.product.variants
      .filter(variant => variant.size === size)
      .filter(item => item.color === this.selectedColor)
    this.selectedColor = isThereElem[0]?.color || null
  }
}
