import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MainPageComponent} from './main-page/main-page.component';
import {EmployeeMComponent} from './employee-m/employee-m.component';
import {WorkHoursComponent} from './work-hours/work-hours.component';
import {FilesComponent} from './files/files.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main-page', component: MainPageComponent },
  { path: 'employee-m', component: EmployeeMComponent },
  {path: 'work-hours', component: WorkHoursComponent },
  {path: 'files', component: FilesComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
export const routing = RouterModule.forRoot(routes, { useHash: true });
