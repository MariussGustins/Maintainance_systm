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
  /** Pašreiz pieslēgtais lietotājs */
  user: Employee | null = null;
  /** Saraksts ar projektiem */
  projects: Project[] = [];

  constructor(private router: Router, private allDataService: AllDataService) {}

  /**
   * Inicializācijas metode - ielādē lietotāja datus un projektus.
   */
  ngOnInit(): void {
    const userId = sessionStorage.getItem('userId'); // Iegūst ID no sesijas
    if (!userId) {
      this.router.navigate(['/login']); // Novirza uz pierakstīšanos, ja ID nav pieejams
      return;
    }

    this.loadUserData(parseInt(userId, 10));
    this.loadProjects();
  }

  /**
   * Ielādē lietotāja datus.
   * @param employeeId - Lietotāja ID.
   */
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

  /**
   * Ielādē pieejamos projektus.
   */
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

  /** Navigācija uz darbinieku pārvaldības lapu. */
  goToEmployeeManagement() {
    this.router.navigate(['/employee-m']);
  }

  /** Navigācija uz darba stundu pārvaldību. */
  goToWorkHours() {
    this.router.navigate(['/work-hours']);
  }

  /** Navigācija uz failu pārvaldību. */
  goToFiles() {
    this.router.navigate(['/files']);
  }

  /** Navigācija uz krājumu pārvaldību. */
  goToStock(){
    this.router.navigate(['/stock']);
  }

  /**
   * Rediģē izvēlēto projektu.
   * @param projectId - Projekta ID.
   */
  editProject(projectId: number): void {
    const projectToEdit = this.projects.find((project) => project.Id === projectId);
    if (projectToEdit) {
      const newProjectName = prompt('Ievadiet jaunu projekta nosaukumu:', projectToEdit.projectName);
      const newDescription = prompt('Ievadiet jaunu projekta aprakstu:', projectToEdit.description);
      const newStartDate = prompt('Ievadiet jaunu projekta sākuma datumu (YYYY-MM-DD):', projectToEdit.startDate);
      const newEndDate = prompt('Ievadiet jaunu projekta beigu datumu (YYYY-MM-DD):', projectToEdit.endDate);

      if (newProjectName && newDescription && newStartDate && newEndDate) {
        const updatedProject = {
          ...projectToEdit,
          projectName: newProjectName,
          description: newDescription,
          startDate: newStartDate,
          endDate: newEndDate,
        };

        this.allDataService.updateProject(projectId, updatedProject).subscribe(
          (response) => {
            console.log('Project updated:', response);
            this.loadProjects(); // Atjaunina projektu sarakstu
          },
          (error) => {
            console.error('Error updating project:', error);
            alert('Neizdevās atjaunināt projektu.');
          }
        );
      }
    }
  }

  /**
   * Dzēš izvēlēto projektu.
   * @param projectId - Projekta ID.
   */
  deleteProject(projectId: number): void {
    if (confirm('Vai tiešām vēlaties dzēst šo projektu?')) {
      this.allDataService.deleteProject(projectId).subscribe(
        (response) => {
          console.log('Project deleted:', response);
          this.projects = this.projects.filter((project) => project.Id !== projectId); // Noņem no saraksta
        },
        (error) => {
          console.error('Error deleting project:', error);
          alert('Neizdevās dzēst projektu.');
        }
      );
    }
  }
}
