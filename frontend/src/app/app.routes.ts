import { Routes } from '@angular/router';

import { NotFoundComponent, CatalogComponent, ProductComponent, MainComponent } from '../pages';
import {CartComponent} from "../pages/cart/cart.component";
import {LoginComponent} from "../pages/login/login.component";
import {RegisterComponent} from "../pages/register/register.component";


export const routes: Routes = [
  { path: "", component: MainComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "catalog", component: CatalogComponent },
  { path: "catalog/:id", component: ProductComponent },
  { path: "cart", component: CartComponent },
  { path: "**", component: NotFoundComponent }
];
