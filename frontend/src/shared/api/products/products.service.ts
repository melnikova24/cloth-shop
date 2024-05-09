import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Product} from "./models";
import {BASE_URL} from "../../constants";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private http: HttpClient) { }

  getProducts(queryParams: any) {
    let params = new HttpParams(); // Создание нового объекта HttpParams

    if (queryParams) { // Проверка, переданы ли параметры
      for (const key in queryParams) { // Проход по всем ключам в объекте queryParams
        if (queryParams.hasOwnProperty(key)) { // Проверка, существует ли такое свойство в объекте queryParams
          params = params.append(key, queryParams[key]); // Добавление параметра в объект HttpParams
        }
      }
    }

    return this.http.get<Product[]>(BASE_URL + '/products', { params: params });
  }

  getProduct(id: number) {
    return this.http.get<Product>(BASE_URL+'/products/'+id)
  }

  getProductFilters = (subTypeId: string) => {
    return this.http.get(BASE_URL+'/products-filters?subTypeId='+subTypeId, )
  }

  postProduct = (product: Product) => {
    return this.http.post<Product>(BASE_URL+'/products', product)
  }

  patchProduct = (product: Product) => {
    return this.http.patch(BASE_URL+'/products/'+product._id, product)
  }

  deleteProduct = (id: string) => {
    return this.http.delete(BASE_URL+'/products/'+id)
  }

  getLatestProducts = () => {
    return this.http.get<Product[]>(BASE_URL+'/latest')
  }
}
