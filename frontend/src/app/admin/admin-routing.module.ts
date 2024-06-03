import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminDashboardComponent} from "./components/admin-dashboard/admin-dashboard.component";
import {CategoriesComponent} from "./components/categories/categories.component";
import {ProductsComponent} from "./components/products/products.component";
import { OrdersComponent } from './components/orders/orders.component';

const routes: Routes = [
  {path: '', component: AdminDashboardComponent, children: [
      {path: 'categories', component: CategoriesComponent},
      {path: 'products', component: ProductsComponent},
      {path: 'orders', component: OrdersComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
