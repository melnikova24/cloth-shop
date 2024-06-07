import {ChangeDetectorRef, Component, inject, OnInit, TemplateRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CategoryEditFormComponent} from "../../../../features/category-edit-form/category-edit-form.component";
import {CategoryFormComponent} from "../../../../features/category-form/category-form.component";
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle, NgbModal
} from "@ng-bootstrap/ng-bootstrap";
import {CategoriesService, ICategory, IOrder, OrdersService} from "../../../../shared/api";
import {Subscription} from "rxjs";
import {OrderEditFormComponent} from "../../../../features/order-edit-form/order-edit-form.component";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, CategoryEditFormComponent, CategoryFormComponent, NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, OrderEditFormComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent  implements OnInit {
  orders!: IOrder[];
  selectedOrder!: IOrder | null;
  isLoading = false;
  subscription!: Subscription;
  constructor(private ordersService: OrdersService, private cd: ChangeDetectorRef) { }
  private modalService = inject(NgbModal);
  ngOnInit() {
    this.getOrders()
  }

  open(content: TemplateRef<any>, order?: IOrder) {
    if (order) {
      this.selectedOrder = order;
    }
    this.modalService.open(content).result.then();
  }


  getOrders() {
    this.isLoading = true;
    this.subscription = this.ordersService
      .allOrders()
      .subscribe(
        orders => {
          console.log(orders)
          this.orders = orders
          this.cd.detectChanges()
          this.isLoading = false
        }
      )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
