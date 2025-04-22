import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Files } from '../allData.interface';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
  imports: [FormsModule, NgIf, NgForOf],
  standalone: true
})
export class FilesComponent implements OnInit {
  files: Files[] = []; // Lokālā masīvs failiem
  showFileUpload: boolean = false; // Vai tiek rādīts faila augšupielādes logs
  selectedFile: File | null = null; // Izvēlētais fails
  fileDescription: string = ''; // Faila apraksts
  constructor(private router: Router) {}
  errorMessage: string = ''; // Kļūdas ziņojums

  ngOnInit(): void {
    this.loadFilesFromLocalStorage(); // Ielādē failus no lokālās krātuves komponentes inicializēšanas laikā
  }

  // Ielādē failus no lokālās krātuves
  loadFilesFromLocalStorage(): void {
    // Iegūst failus no vietējās krātuves (ja tie tur ir)
    const storedFiles = localStorage.getItem('files');
    if (storedFiles) {
      this.files = JSON.parse(storedFiles);
    }
  }

  // Saglabā failus lokālajā krātuvē
  saveFilesToLocalStorage(): void {
    // Saglabā failus vietējā krātuvē, lai saglabātu datus arī pēc lapas atsvaidzināšanas
    localStorage.setItem('files', JSON.stringify(this.files));
  }

  // Atver faila augšupielādes logu
  openFileUpload(): void {
    this.showFileUpload = true;
  }

  // Aizver faila augšupielādes logu
  closeFileUpload(): void {
    this.showFileUpload = false;
    this.selectedFile = null;
    this.fileDescription = '';
  }

  // Apstrādā faila izvēli
  onFileSelected(event: any): void {
    // Iegūst izvēlēto failu
    this.selectedFile = event.target.files[0];
    console.log('Izvēlētais fails:', this.selectedFile);
  }

  // Augšupielādē failu lokāli
  uploadFile(event: Event): void {
    event.preventDefault(); // Novērš formas atsvaidzināšanu

    // Pārbauda, vai ir izvēlēts fails un ievadīts apraksts
    if (!this.selectedFile || !this.fileDescription) {
      this.errorMessage = 'Izvēlieties failu un ievadiet aprakstu.'; // Ja nav izvēlēts fails vai apraksts
      return;
    }

    // Ja viss ir pareizi, veicam faila saglabāšanu
    const newFile: Files = {
      fileName: this.selectedFile.name,
      fileSize: this.selectedFile.size / 1024, // Konvertē uz KB
      date: new Date().toLocaleDateString(),
      description: this.fileDescription,
      filePath: this.selectedFile.name, // Faila nosaukums kā ceļš
      fileType: this.selectedFile.type,
      IsActive: true,
      EmployeeIdentId: 1, // Piemērs darbinieka ID
      Id: this.files.length + 1 // Jauns ID
    };

    // Pievieno failu lokālajam masīvam
    this.files.push(newFile);

    // Saglabā failus lokālajā krātuvē (ja nepieciešams)
    this.saveFilesToLocalStorage();

    // Atiestata formu un aizver logu
    this.closeFileUpload();
    this.errorMessage = ''; // Notīra kļūdas ziņojumu
  }






  // Apstrādā faila lejupielādi (lokāli)
  downloadFile(): void {
    // Piemērs ar lokālo failu (ja tev ir faila dati)
    const fileContent = 'Tas ir test faila saturs!'; // Tev jābūt faila saturam
    const fileName = 'testfailu.txt'; // Faila nosaukums

    // Izveidojiet Blob objektu ar faila saturu
    const blob = new Blob([fileContent], { type: 'text/plain' });

    // Izveidojiet lejupielādes saiti
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob); // Pievienojam Blob URL
    link.download = fileName; // Lejupielādes fails ar izvēlēto nosaukumu

    // Izsaucam lejupielādes notikumu
    link.click();
  }

  // Atgriežas uz iepriekšējo lapu
  goBack(): void {
    this.router.navigate(['/main-page']);
  }
}
