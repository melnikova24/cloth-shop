import { Routes } from '@angular/router';

import { NotFoundComponent, CatalogComponent, ProductComponent, MainComponent } from '../pages';
import {CartComponent} from "../pages/cart/cart.component";
import {LoginComponent} from "../pages/login/login.component";
import {RegisterComponent} from "../pages/register/register.component";
import {alreadyLoggedInGuard} from "../shared/guards/already-logged-in.guard";
import {ProfileComponent} from "../pages/profile/profile.component";
import {authActivateGuard} from "../shared/guards/auth.guard";
import {adminGuard} from "../shared/guards/admin.guard";
import {ContactsComponent} from "../pages/contacts/contacts.component";
import {AboutusComponent} from "../pages/aboutus/aboutus.component";
import {FaqComponent} from "../pages/faq/faq.component";
import {RefundComponent} from "../pages/refund/refund.component";
import {FavoriteComponent} from "../pages/favorite/favorite.component";


export const routes: Routes = [
  { path: "", component: MainComponent },
  { path: "login", component: LoginComponent, canActivate: [alreadyLoggedInGuard] },
  { path: "profile", component: ProfileComponent, canActivate: [authActivateGuard] },
  { path: "register", component: RegisterComponent, canActivate: [alreadyLoggedInGuard] },
  { path: "register", component: RegisterComponent, canActivate: [alreadyLoggedInGuard] },
  { path: "catalog/:type", component: CatalogComponent },
  { path: "catalog/:type/:id", component: ProductComponent },
  { path: "cart", component: CartComponent, canActivate: [authActivateGuard] },
  { path: "favorite", component: FavoriteComponent, canActivate: [authActivateGuard] },
  { path: "contacts", component: ContactsComponent },
  { path: "about", component: AboutusComponent },
  { path: "faq", component: FaqComponent },
  { path: "refund", component: RefundComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [adminGuard]
  },
  { path: "**", component: NotFoundComponent, redirectTo: "" }
];
