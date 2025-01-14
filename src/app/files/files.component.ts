import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllDataService } from '../allData.service';
import { Files } from '../allData.interface';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class FilesComponent implements OnInit {
  files: Files[] = [];
  user: any;
  errorMessage: string = '';
  showFileUpload: boolean = false;
  selectedFile: File | null = null;
  fileDescription: string = '';

  constructor(
    private router: Router,
    private allDataService: AllDataService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Fetch logged-in user from session storage
    const userData = sessionStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      const employeeId = this.user.id;
      this.fetchFilesForEmployee(employeeId);
    } else {
      this.router.navigate(['/login']);
    }
  }

  fetchFilesForEmployee(employeeId: number): void {
    this.allDataService.getFilesByEmployeeId(employeeId).subscribe({
      next: (data) => {
        this.files = data;
        console.log('Files fetched:', this.files);
      },
      error: (err) => {
        this.errorMessage = 'Neizdevās ielādēt failus';
        console.error(err);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/main-page']);
  }

  openFileUpload(): void {
    this.showFileUpload = true;
  }

  closeFileUpload(): void {
    this.showFileUpload = false;
    this.selectedFile = null;
    this.fileDescription = '';
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);
  }

  uploadFile(event: Event): void {
    event.preventDefault();

    console.log('File to upload:', this.selectedFile);
    console.log('File description:', this.fileDescription);

    if (!this.selectedFile || !this.fileDescription) {
      alert('Izvēlieties failu un ievadiet aprakstu.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('description', this.fileDescription);
    formData.append('employeeIdentId', this.user.id.toString());

    this.http.post(`${this.allDataService.apiUrl}/Files`, formData).subscribe({
      next: () => {
        alert('Fails veiksmīgi augšupielādēts!');
        this.fetchFilesForEmployee(this.user.id);
        this.closeFileUpload();
      },
      error: (err) => {
        this.errorMessage = 'Neizdevās augšupielādēt failu';
        console.error(err);
      },
    });
  }

  downloadFile(filePath: string): void {
    const fileUrl = `${this.allDataService.apiUrl}/Files/download?filePath=${encodeURIComponent(filePath)}`;
    window.open(fileUrl, '_blank');
  }
}
