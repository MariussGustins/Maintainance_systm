import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllDataService } from '../allData.service';
import { Project } from '../allData.interface';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  user: any;
  projects: Project[] = [];

  constructor(private router: Router, private allDataService: AllDataService) {}

  ngOnInit(): void {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      this.router.navigate(['/login']); // Redirect to login if not authenticated
    }

    // Iegūt projektus no backend
    this.loadProjects();
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

  editProject(projectId: number): void {
    console.log('Edit project with ID:', projectId);

  }

  deleteProject(projectId: number): void {
    console.log('Delete project with ID:', projectId);

  }
}
