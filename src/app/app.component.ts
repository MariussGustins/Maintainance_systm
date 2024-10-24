import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { Router } from '@angular/router';
import {CommonModule} from "@angular/common";
import {LoginComponent} from "./login/login.component";
import {MainPageComponent} from './main-page/main-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoginComponent, MainPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Maintainance_systm';

  constructor(private router: Router) {

    this.router.resetConfig(routes);
  }
}
