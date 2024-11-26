import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllDataService } from '../allData.service';
import { Employee, EmployeeIdent, EmployeeWithIdentDTO } from '../allData.interface';
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
}
