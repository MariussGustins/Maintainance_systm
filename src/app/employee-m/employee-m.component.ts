import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllDataService } from '../allData.service';
import { EmployeeWithIdentDTO } from '../allData.interface';
import { CommonModule } from '@angular/common';

/**
 * Autors: Mariuss Gustins
 * Mērķis: Darbinieku pārvaldības komponents, kas attēlo darbinieku sarakstu,
 *         atbalsta paroles redzamības pārslēgšanu un nodrošina labošanu/dzēšanu.
 */


@Component({
  selector: 'app-employee-m',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-m.component.html',
  styleUrls: ['./employee-m.component.css']
})
export class EmployeeMComponent implements OnInit {
  /** Saraksts ar darbiniekiem un to identifikatoriem */
  employeesWithIdent: EmployeeWithIdentDTO[] = [];

  /** Paroļu redzamības statuss */
  passwordVisibility: boolean[] = [];

  constructor(
    private router: Router,
    private allDataService: AllDataService
  ) {}

  /**
   * Komponentes inicializācijas metode, kas izsauc darbinieku saraksta iegūšanu.
   */
  ngOnInit(): void {
    this.fetchEmployeesAndIdents();
  }

  /**
   * Iegūst darbinieku sarakstu no servera un saglabā to lokāli.
   */
  fetchEmployeesAndIdents() {
    this.allDataService.getAllEmployeesWithIdents().subscribe({
      next: (data) => {
        this.employeesWithIdent = data;
        this.passwordVisibility = new Array(data.length).fill(false);
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching employees with ident data:', error);
        alert('Failed to fetch employee data. Please try again.');
      }
    });
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
