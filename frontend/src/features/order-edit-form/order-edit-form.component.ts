import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle
} from "@ng-bootstrap/ng-bootstrap";
import {CategoriesService, ICategory, IOrder, OrdersService} from "../../shared/api";
import {SubtypeService} from "../../shared/api/subtypes";

@Component({
  selector: 'app-order-edit-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, ReactiveFormsModule],
  templateUrl: './order-edit-form.component.html',
  styleUrl: './order-edit-form.component.scss'
})
export class OrderEditFormComponent implements OnInit {
  formGroup1!: FormGroup;

  statuses: string[] = ['В обработке', 'Выполнен', 'Отменен'];

  @Input() selectedOrder!: IOrder | null;
  @Output() getOrders = new EventEmitter<string>();
  AddOrderEmit(order: IOrder): void {
    this.getOrders.emit();
  }

  @Output() closeModal = new EventEmitter();
  closeModalEmit (): void {
    this.closeModal.emit();
  }

  constructor(private fb: FormBuilder, private orderService: OrdersService) {

  }

  ngOnInit() {
    console.log(this.selectedOrder?.status)
    this.formGroup1 = this.fb.group({
      status: [this.selectedOrder?.status || ''],
    });
    // @ts-ignore
  }

  submit() {
    const order = {
      ...this.selectedOrder,
      ...this.formGroup1.value,
    }
    // @ts-ignore
    this.orderService.editOrder(order).subscribe({
      next: (data) => {
        this.AddOrderEmit(data)
        this.closeModal.emit()
        this.closeModalEmit()
      },
      error: err => {
        alert("Произошла ошибка")
      }
    })
  }

  changeStatus(status: string) {
    this.formGroup1.get('status')?.setValue(status);
  }
}
