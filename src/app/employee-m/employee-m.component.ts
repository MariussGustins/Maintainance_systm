import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllDataService } from '../allData.service';
import { EmployeeWithIdentDTO } from '../allData.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-m',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-m.component.html',
  styleUrls: ['./employee-m.component.css']
})
export class EmployeeMComponent implements OnInit {
  employeesWithIdent: EmployeeWithIdentDTO[] = [];

  constructor(
    private router: Router,
    private allDataService: AllDataService
  ) {}

  ngOnInit(): void {
    this.fetchEmployeesAndIdents();
  }

  fetchEmployeesAndIdents() {
    this.allDataService.getAllEmployeesWithIdents().subscribe({
      next: (data) => {
        this.employeesWithIdent = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching employees with ident data:', error);
        alert('Failed to fetch employee data. Please try again.');
      }
    });
  }

  deleteEmployee(index: number): void {
    if (confirm('Vai tiešām vēlaties dzēst šo darbinieku?')) {
      this.employeesWithIdent.splice(index, 1);
      console.log('Employee deleted:', this.employeesWithIdent[index]);
    }
  }

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

  goBack(): void {
    this.router.navigate(['/main-page']);
  }
}
