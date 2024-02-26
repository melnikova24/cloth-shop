import { Routes } from '@angular/router';

import { NotFoundComponent, CatalogComponent, ProductComponent, MainComponent } from '../pages';
import {CartComponent} from "../pages/cart/cart.component";


export const routes: Routes = [
  { path: "", component: MainComponent },
  { path: "catalog", component: CatalogComponent },
  { path: "catalog/:id", component: ProductComponent },
  { path: "cart", component: CartComponent },
  { path: "**", component: NotFoundComponent }
];
