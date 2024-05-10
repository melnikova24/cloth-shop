import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle
} from "@ng-bootstrap/ng-bootstrap";
import {Product} from "../../shared/api";
import {FavoritesService} from "../../shared/services/favorites.service";

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {
  products!: Product[];

  constructor(private favoritesService: FavoritesService) {

  }

  ngOnInit(): void {
    this.products = this.favoritesService.getFavorites();
  }

  isFavorite(product: Product) {
    return this.favoritesService.inFavorites(product)
  }

  addToFavorite(product: Product) {
    this.favoritesService.addFavorite(product)
  }

  clearFavorites() {
    this.favoritesService.clearFavorites()
    this.products = []
  }

  favoritesCount() {
    return this.favoritesService.countFavorites()
  }
}
