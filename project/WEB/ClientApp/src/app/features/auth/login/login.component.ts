import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container" style="max-width: 450px; margin-top: 4rem;">
      <div class="card" style="padding: 2.5rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h2 style="font-size: 1.875rem; font-weight: 700; color: var(--gray-800); margin-bottom: 0.5rem;">
            Welcome Back
          </h2>
          <p style="color: var(--gray-600);">Sign in to your JobPortal account</p>
        </div>
        
        <div *ngIf="errorMessage" class="alert alert-danger">
          {{errorMessage}}
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input 
              type="text" 
              class="form-control"
              [class.is-invalid]="isFieldInvalid('username')"
              formControlName="username"
              placeholder="Enter your username">
            <div *ngIf="isFieldInvalid('username')" class="invalid-feedback">
              Username is required
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              class="form-control"
              [class.is-invalid]="isFieldInvalid('password')"
              formControlName="password"
              placeholder="Enter your password">
            <div *ngIf="isFieldInvalid('password')" class="invalid-feedback">
              Password is required
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary" 
            [disabled]="loginForm.invalid || isLoading"
            style="width: 100%; margin-bottom: 1.5rem; padding: 0.875rem;">
            {{isLoading ? 'Signing in...' : 'Sign In'}}
          </button>
        </form>

        <div style="text-align: center; margin-top: 1.5rem;">
          <p style="color: var(--gray-600); margin-bottom: 1rem;">Don't have an account?</p>
          <a routerLink="/auth/register" class="btn btn-outline" style="width: 100%; padding: 0.875rem;">
            Create Account
          </a>
        </div>

        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--gray-200);">
          <p style="color: var(--gray-600); font-size: 0.875rem; text-align: center; margin-bottom: 0.5rem;">
            Demo Credentials:
          </p>
          <p style="color: var(--gray-700); font-size: 0.875rem; text-align: center; font-family: 'SF Mono', Monaco, monospace; background: var(--gray-50); padding: 0.5rem; border-radius: 0.5rem;">
            Username: <strong>admin</strong> | Password: <strong>admin</strong>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.user.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/jobs']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}