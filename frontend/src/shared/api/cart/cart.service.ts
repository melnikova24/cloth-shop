import { Injectable } from '@angular/core';
import {Product} from "../products";
import {HttpClient} from "@angular/common/http";
import {BASE_URL} from "../../constants";
import {from, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private http: HttpClient) { }

  getCartItems(): Observable<Product[]> {
    const cart = this.http.get<Product[]>(BASE_URL+'/cart');
    return cart ? cart : from([]);
  }

  editCart(product: Product): Observable<Product[]> {
    const cart = this.http.post<Product[]>(BASE_URL+'/cart', product);
    return cart ? cart : from([]);
  }
}
