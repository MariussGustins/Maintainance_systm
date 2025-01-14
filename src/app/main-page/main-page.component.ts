import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllDataService } from '../allData.service';
import {Employee, Project} from '../allData.interface';
import {NgClass, NgOptimizedImage,CommonModule} from '@angular/common';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    NgClass,
    NgOptimizedImage,
    CommonModule
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  user: Employee | null = null;
  projects: Project[] = [];

  constructor(private router: Router, private allDataService: AllDataService) {}

  ngOnInit(): void {
    const userId = sessionStorage.getItem('userId'); // Iegūst ID no sesijas
    if (!userId) {
      this.router.navigate(['/login']); // Novirza uz pierakstīšanos, ja ID nav pieejams
      return;
    }

    // Ielādē lietotāja datus
    this.loadUserData(parseInt(userId, 10));

    this.loadProjects();
  }
  loadUserData(employeeId: number): void {
    this.allDataService.getEmployeeById(employeeId).subscribe(
      (employee) => {
        this.user = employee;
        console.log('User data loaded:', this.user);
      },
      (error) => {
        console.error('Error loading user data:', error);
      }
    );
  }

  loadProjects(): void {
    this.allDataService.getAllProjects().subscribe(
      (projects) => {
        this.projects = projects;
        console.log('Projects loaded:', projects);
      },
      (error) => {
        console.error('Error loading projects:', error);
      }
    );
  }

  goToEmployeeManagement() {
    this.router.navigate(['/employee-m']);
  }

  goToWorkHours() {
    this.router.navigate(['/work-hours']);
  }

  goToFiles() {
    this.router.navigate(['/files']);
  }
  goToStock(){
    this.router.navigate(['/stock']);
  }

  editProject(projectId: number): void {
    console.log('Edit project with ID:', projectId);

  }

  deleteProject(projectId: number): void {
    console.log('Delete project with ID:', projectId);

  }
}
