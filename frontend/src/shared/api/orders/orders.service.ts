import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IOrder} from "./models";
import {BASE_URL} from "../../constants";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private httpClient: HttpClient) { }



  getOrders() {
    return this.httpClient.get<IOrder[]>(BASE_URL+'/orders');
  }

  createOrder(order: any) {
    return this.httpClient.post<IOrder>(BASE_URL+'/orders', order);
  }

  editOrder(order: IOrder) {
    return this.httpClient.patch<IOrder>(BASE_URL+'/orders/' + order._id, order);
  }
}
