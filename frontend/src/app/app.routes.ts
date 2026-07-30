import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminDashboardComponent } from './components/admin/dashboard/admin-dashboard.component';
import { ProductFormComponent } from './components/admin/product-form/product-form.component';
import { CategoryListComponent } from './components/admin/categories/category-list.component';
import { CategoryFormComponent } from './components/admin/categories/category-form.component';
import { UserListComponent } from './components/admin/users/user-list.component';
import { ReportComponent } from './components/admin/reports/report.component';
import { CheckoutComponent } from './components/shop/checkout/checkout.component';
import { ProductDetailComponent } from './components/shop/product-detail/product-detail.component';
import { adminGuard } from './helpers/admin.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/inventory',
    component: AdminComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/inventory/new',
    component: ProductFormComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/inventory/edit/:id',
    component: ProductFormComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/categories',
    component: CategoryListComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/categories/new',
    component: CategoryFormComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/categories/edit/:id',
    component: CategoryFormComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/users',
    component: UserListComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/reports',
    component: ReportComponent,
    canActivate: [adminGuard]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
