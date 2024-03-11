import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Product} from "./models";
import {BASE_URL} from "../../constants";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<Product[]>(BASE_URL+'/products')
  }

  getProduct(id: number) {
    return this.http.get<Product>(BASE_URL+'/products/'+id)
  }
}
