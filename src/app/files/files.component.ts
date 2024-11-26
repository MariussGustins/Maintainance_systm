import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllDataService } from '../allData.service';
import { Files } from '../allData.interface';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [],
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
})
export class FilesComponent implements OnInit {
  files: Files[] = []; // To store files fetched from the backend
  user: any; // Logged-in user data
  errorMessage: string = ''; // For handling errors

  constructor(private router: Router, private allDataService: AllDataService) {}

  ngOnInit(): void {
    // Fetch logged-in user from session storage
    const userData = sessionStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      const employeeId = this.user.Id; // Assuming `Id` is the EmployeeIdentId
      this.fetchFilesForEmployee(employeeId);
    } else {
      this.router.navigate(['/login']); // Redirect to login if not authenticated
    }
  }

  fetchFilesForEmployee(employeeId: number): void {
    this.allDataService.getFilesByEmployeeId(employeeId).subscribe({
      next: (data) => {
        this.files = data;
        console.log('Files fetched:', this.files);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load files';
        console.error(err);
      },
    });
  }
}
