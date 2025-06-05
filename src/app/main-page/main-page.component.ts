/*
  Autors: Mariuss Gustins
  Apraksts: Galvenās lapas komponents, kas atbild par lietotāja datu un projektu ielādi,
            kā arī nodrošina navigāciju uz dažādām pārvaldības sadaļām.
  Atslēgvārdi: lietotāja dati, projekti, navigācija, darbinieku pārvaldība, inventarizācija
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllDataService } from '../allData.service';
import {Employee, Project, EmployeeRoles} from '../allData.interface';
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

    if (this.user) {
      this.loadUserRole(this.user.role_Id);
    }

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

        // Make sure the Role_ID is valid before calling loadUserRole
        if (this.user && this.user.role_Id) {
          this.loadUserRole(this.user.role_Id);
        } else {
          console.error('Role_ID is not available in user data');
        }
      },
      (error) => {
        console.error('Error loading user data:', error);
      }
    );

  }
// Function to load role by Role_ID
  loadUserRole(roleId: number): void {
    if (!roleId) {
      console.error('Invalid roleId:', roleId);
      return;
    }

    this.allDataService.getEmployeeRoleByRoleId(roleId).subscribe(
      (role) => {
        console.log('Role fetched:', role);  // Log the fetched role
        if (this.user) {
          this.user.roleName = role.roleName;
        }
      },
      (error) => {
        console.error('Error fetching role data:', error);
        if (this.user) {
          this.user.roleName = 'Unknown';  // Fallback if error occurs
        }
      }
    );
  }

  /**
   * Ielādē pieejamos projektus.
   */
  loadProjects(): void {
    this.allDataService.getAllProjects().subscribe(
      (projects) => {
        const today = new Date();
        projects.forEach(project => {
          const projectEndDate = new Date(project.endDate);
          project.isActive = projectEndDate >= new Date(today.setHours(0, 0, 0, 0));
        });

        this.projects = projects; // keep your assignment line
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

    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;

    const field = prompt(
      'Kuru lauku vēlaties rediģēt?\n1 - Nosaukums\n2 - Apraksts\n3 - Sākuma datums\n4 - Beigu datums'
    );

    let updatedProject = { ...project };

    switch (field) {
      case '1':
        const name = prompt('Jaunais nosaukums:', project.projectName);
        if (name) updatedProject.projectName = name;
        break;
      case '2':
        const desc = prompt('Jaunais apraksts:', project.description);
        if (desc) updatedProject.description = desc;
        break;
      case '3':
        const start = prompt('Jaunais sākuma datums:', project.startDate);
        if (start) updatedProject.startDate = start;
        break;
      case '4':
        const end = prompt('Jaunais beigu datums:', project.endDate);
        if (end) updatedProject.endDate = end;
        break;
      default:
        return;
    }

    this.allDataService.updateProject(projectId, updatedProject).subscribe(() => {
      this.loadProjects();
    });
  }

  /**
   * Dzēš izvēlēto projektu.
   * @param projectId - Projekta ID.
   */
  deleteProject(projectId: number): void {
    if (confirm('Vai tiešām vēlaties dzēst šo projektu?')) {
      console.log('Projects before deletion:', this.projects);

      this.allDataService.deleteProject(projectId).subscribe(
        () => {
          console.log(`Project with ID ${projectId} deleted successfully`);
          this.projects = this.projects.filter(project => project.id !== projectId);
          console.log('Projects after deletion:', this.projects);
        },
        (error) => {
          console.error('Error deleting project:', error);
          alert('Neizdevās dzēst projektu.');
        }
      );
    }
  }
  addProject(): void {
    const name = prompt('Ievadiet projekta nosaukumu:');
    const description = prompt('Ievadiet projekta aprakstu:');
    const startDate = prompt('Ievadiet sākuma datumu (YYYY-MM-DD):');
    const endDate = prompt('Ievadiet beigu datumu (YYYY-MM-DD):');

    if (name && description && startDate && endDate) {
      const newProject: Project = {
        id: 0,
        projectName: name,
        description,
        startDate,
        endDate,
        isActive: true
      };

      this.allDataService.createProject(newProject).subscribe(() => {
        this.loadProjects(); // Pārlādē sarakstu
      });
    }
  }
  getUserProjects(username: string): number[] {
    const projectMap = JSON.parse(localStorage.getItem('userProjects') || '{}');
    return Array.isArray(projectMap[username]) ? projectMap[username] : [];
  }
  logout(): void {
    sessionStorage.clear(); // Clear all session data
    this.router.navigate(['/login']); // Redirect to login page
  }

}

