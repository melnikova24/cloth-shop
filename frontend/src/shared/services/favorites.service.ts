import { Injectable } from '@angular/core';
import {Product} from "../api";

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  constructor() { }

  getFavorites(): Product[] {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  }

  addFavorite(product: Product): Product[] {
    const favorites = this.getFavorites();
    if (this.inFavorites(product)) {
      localStorage.setItem('favorites', JSON.stringify(favorites.filter(favorite => favorite._id !== product._id)));
    } else {
      favorites.push(product);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    return this.getFavorites()
  }

  inFavorites(product: Product): boolean {
    const favorites = this.getFavorites();
    return favorites.some(favorite => favorite._id === product._id);
  }

  clearFavorites() {
    localStorage.setItem('favorites', JSON.stringify([]));
  }

  countFavorites(): number {
    return this.getFavorites().length
  }
}
