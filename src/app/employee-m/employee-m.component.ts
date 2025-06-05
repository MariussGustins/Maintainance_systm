import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllDataService } from '../allData.service';
import { EmployeeWithProject } from '../allData.interface';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

/**
 * Autors: Mariuss Gustins
 * Mērķis: Darbinieku pārvaldības komponents, kas attēlo darbinieku sarakstu,
 *         atbalsta paroles redzamības pārslēgšanu un nodrošina labošanu/dzēšanu.
 */


@Component({
  selector: 'app-employee-m',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-m.component.html',
  styleUrls: ['./employee-m.component.css']
})
export class EmployeeMComponent implements OnInit {
  /** Saraksts ar darbiniekiem un to identifikatoriem */
  employeesWithIdent: EmployeeWithProject[] = [];

  /** Paroļu redzamības statuss */
  passwordVisibility: boolean[] = [];
  /** Projektu masivs */
  projects: any[] = [];
  selectedEmployeeIndex: number | null = null;

  constructor(
    private router: Router,
    private allDataService: AllDataService
  ) {}

  /**
   * Komponentes inicializācijas metode, kas izsauc darbinieku saraksta iegūšanu.
   */
  ngOnInit(): void {
    this.fetchEmployeesAndIdents();
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

  /**
   * Iegūst darbinieku sarakstu no servera un saglabā to lokāli.
   */
  fetchEmployeesAndIdents(): void {
    this.allDataService.getAllEmployeesWithIdents().subscribe({
      next: (data) => {
        this.employeesWithIdent = data.map((emp) => {
          const assigned = this.getAssignedProject(emp.username);
          return {
            ...emp,
            project: Array.isArray(assigned) ? assigned : []
          };
        });
        this.passwordVisibility = new Array(data.length).fill(false);
      },
      error: (error) => {
        console.error('Error fetching employees with ident data:', error);
        alert('Failed to fetch employee data. Please try again.');
      }
    });
  }


  // funkcija, lai dabūtu piešķirto projektu konkrētam lietotājam
  getAssignedProject(username: string): number[] {
    const projectMap = JSON.parse(localStorage.getItem('userProjects') || '{}');
    return Array.isArray(projectMap[username]) ? projectMap[username] : [];
  }

  // Izsaucam šo, kad lietotājs izvēlas projektu no dropdown
  updateProjects(index: number): void {
    const employee = this.employeesWithIdent[index];
    if (Array.isArray(employee.project)) {
      this.assignProjectsToUser(employee.username, employee.project);
    }
  }
  assignProjectsToUser(username: string, projectIds: number[]): void {
    const projectMap = JSON.parse(localStorage.getItem('userProjects') || '{}');
    projectMap[username] = projectIds;
    localStorage.setItem('userProjects', JSON.stringify(projectMap));
  }
  onCheckboxChange(employee: EmployeeWithProject, projectId: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    if (!employee.project) {
      employee.project = [];
    }

    if (checkbox.checked) {
      if (!employee.project.includes(projectId)) {
        employee.project.push(projectId);
      }
    } else {
      employee.project = employee.project.filter(id => id !== projectId);
    }

    this.assignProjectsToUser(employee.username, employee.project);
  }


  /**
   * Dzēš izvēlēto darbinieku no saraksta.
   * @param index - Darbinieka indekss sarakstā.
   */
  deleteEmployee(index: number): void {
    if (confirm('Vai tiešām vēlaties dzēst šo darbinieku?')) {
      console.log('Employee deleted:', this.employeesWithIdent[index]);
      this.employeesWithIdent.splice(index, 1);
      this.passwordVisibility.splice(index, 1);
    }
  }

  /**
   * Atjaunina izvēlētā darbinieka lietotājvārdu un paroli.
   * @param index - Darbinieka indekss sarakstā.
   */
  updateEmployee(index: number): void {
    const employee = this.employeesWithIdent[index];
    const newUsername = prompt('Ievadiet jaunu lietotājvārdu:', employee.username);
    const newPassword = prompt('Ievadiet jaunu paroli:', employee.password);

    if (newUsername && newPassword) {
      this.employeesWithIdent[index] = {
        ...employee,
        username: newUsername,
        password: newPassword,
      };
      console.log('Employee updated:', this.employeesWithIdent[index]);
    }
  }

  /**
   * Pārslēdz paroles redzamību.
   * @param index - Darbinieka indekss sarakstā.
   */
  togglePassword(index: number): void {
    this.passwordVisibility[index] = !this.passwordVisibility[index];
  }

  /**
   * Atgriežas uz galveno lapu.
   */
  goBack(): void {
    this.router.navigate(['/main-page']);
  }

}
