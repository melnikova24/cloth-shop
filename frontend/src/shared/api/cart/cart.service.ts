import { Injectable } from '@angular/core';
import {Product} from "../products";
import {HttpClient} from "@angular/common/http";
import {BASE_URL} from "../../constants";
import {from, map, Observable} from "rxjs";

export type CartType = {
  products: string[]
  _id: string
  personId: string
  productsList?: Product[]
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private http: HttpClient) { }

  getCartItems(param: string): Observable<CartType> {
    const cart = this.http.get<CartType>(BASE_URL+'/cart?from='+param);
    return cart ? cart : from([]);
  }

  editCart(products: string[], productsList?: Product[]): Observable<CartType> {
    const cart = this.http.post<CartType>(BASE_URL+'/cart', {products, productsList});
    return cart ? cart : from([]);
  }
}
