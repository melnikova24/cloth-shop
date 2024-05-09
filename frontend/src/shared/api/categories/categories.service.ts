import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BASE_URL} from "../../constants";
import {ICategory} from "./models";
import {Product} from "../products";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  getCategories(subTypedId: string) {
    return this.http.get<ICategory[]>(BASE_URL+'/categories?subTypeId='+subTypedId);
  }

  postCategory = (category: ICategory) => {
    return this.http.post<ICategory>(BASE_URL+'/categories', category)
  }

  patchCategory = (category: ICategory) => {
    return this.http.patch(BASE_URL+'/categories/'+category._id, category)
  }

  deleteCategory = (id: number) => {
    return this.http.delete(BASE_URL+'/categories/'+id)
  }
}
