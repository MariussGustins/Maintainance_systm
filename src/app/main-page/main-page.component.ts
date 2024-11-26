import { Component,OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit {
  user:any;
  constructor(private router: Router) {}
  ngOnInit(): void {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      this.router.navigate(['/login']); // Redirect to login if not authenticated
    }
  }
  goToEmployeeManagement() {
    this.router.navigate(['/employee-m']);
  }
  goToWorkHours(){
    this.router.navigate(['/work-hours']);
  }
  goToFiles(){
    this.router.navigate(['/files']);
  }
}
