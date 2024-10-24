import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MainPageComponent} from './main-page/main-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main-page', component: MainPageComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
export const routing = RouterModule.forRoot(routes, { useHash: true });
