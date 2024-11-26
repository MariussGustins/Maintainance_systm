import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule], // Add this
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  serverError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;

    this.isLoading = true;
    this.authService.login(username, password).subscribe(
      (response: any) => {
        console.log('Login successful', response);

        sessionStorage.setItem('user', JSON.stringify(response));
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
