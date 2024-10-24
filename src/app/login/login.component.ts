import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  //test credentials
  private readonly defaultUsername = 'admin';
  private readonly defaultPassword = 'admin123';

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    // Initialize the login form
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Method to handle form submission
  onSubmit(): void {
    const { username, password } = this.loginForm.value;

    // Check if the entered credentials match the default ones
    if (username === this.defaultUsername && password === this.defaultPassword) {
      console.log('Login successful!');
      // Navigate to the main page
      this.router.navigate(['/main-page']);
    } else {
      console.log('Invalid username or password');
      alert('Invalid username or password');
    }
  }
}
