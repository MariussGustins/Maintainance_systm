/**
 * Autors: Mariuss Gustins
 * Apraksts: Pieteikšanās komponents, kas nodrošina lietotāja autentifikāciju,
 *           formas validāciju un pāreju uz galveno lapu pēc veiksmīgas pieteikšanās.
 * Atslēgvārdi: pieteikšanās, autentifikācija, lietotājs, formas validācija
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Add this
})
export class LoginComponent implements OnInit {
  /** Pieteikšanās forma */
  public loginForm!: FormGroup;
  /** Statuss, kas norāda, vai notiek ielāde */
  isLoading = false;
  /** Kļūdas ziņojums servera autentifikācijas neveiksmei */
  serverError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Komponentes inicializācija - izveido pieteikšanās formas struktūru.
   */
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
      ]],
    });
  }

  /**
   * Apstrādā pieteikšanās pieprasījumu.
   * Ja forma ir nederīga, funkcija pārtrauc izpildi.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;

    this.isLoading = true;
    this.authService.login(username, password).subscribe(
      (response: any) => {
        console.log('Login successful', response);

        // Saglabā lietotāja informāciju sesijā
        sessionStorage.setItem('userId', response.id.toString());
        sessionStorage.setItem('user', JSON.stringify(response));
        console.log('Navigating to main page...');
        this.router.navigate(['/main-page']);
      },
      (error) => {
        console.error('Login failed', error);
        this.serverError = 'Invalid username or password';
        this.isLoading = false;
      }
    );
  }
}

