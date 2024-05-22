import {Component, OnDestroy, OnInit} from '@angular/core';
import {IOrder, OrdersService} from "../../shared/api";
import {AuthService} from "../../shared/api/auth";
import {Observable} from "rxjs";
import {StorageService} from "../../shared/services/storage.service";
import {AsyncPipe, NgForOf} from "@angular/common";


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  orders!: Observable<IOrder[]>

  constructor(private orderService: OrdersService, private storageService: StorageService) { }

  ngOnInit(): void {
    this.getOrders()
  }

  ngOnDestroy(): void {

  }

  getDate(date: string) {
    return new Date(date).toLocaleDateString()
  }

  getUserName() {
    return this.storageService.getUser().user.name
  }

  getOrders() {
    this.orders = this.orderService.getOrders()
  }

}
