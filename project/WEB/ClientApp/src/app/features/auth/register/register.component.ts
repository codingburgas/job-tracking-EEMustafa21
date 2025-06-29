import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container" style="max-width: 500px; margin-top: 4rem;">
      <div class="card" style="padding: 2.5rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h2 style="font-size: 1.875rem; font-weight: 700; color: var(--gray-800); margin-bottom: 0.5rem;">
            Create Account
          </h2>
          <p style="color: var(--gray-600);">Join JobPortal and find your dream job</p>
        </div>
        
        <div *ngIf="errorMessage" class="alert alert-danger">
          {{errorMessage}}
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input 
                type="text" 
                class="form-control"
                [class.is-invalid]="isFieldInvalid('firstName')"
                formControlName="firstName"
                placeholder="First name">
              <div *ngIf="isFieldInvalid('firstName')" class="invalid-feedback">
                First name is required
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input 
                type="text" 
                class="form-control"
                [class.is-invalid]="isFieldInvalid('lastName')"
                formControlName="lastName"
                placeholder="Last name">
              <div *ngIf="isFieldInvalid('lastName')" class="invalid-feedback">
                Last name is required
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Middle Name (Optional)</label>
            <input 
              type="text" 
              class="form-control"
              formControlName="middleName"
              placeholder="Middle name">
          </div>

          <div class="form-group">
            <label class="form-label">Username</label>
            <input 
              type="text" 
              class="form-control"
              [class.is-invalid]="isFieldInvalid('username')"
              formControlName="username"
              placeholder="Choose a username">
            <div *ngIf="isFieldInvalid('username')" class="invalid-feedback">
              <span *ngIf="registerForm.get('username')?.errors?.['required']">Username is required</span>
              <span *ngIf="registerForm.get('username')?.errors?.['minlength']">Username must be at least 3 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              class="form-control"
              [class.is-invalid]="isFieldInvalid('password')"
              formControlName="password"
              placeholder="Choose a strong password">
            <div *ngIf="isFieldInvalid('password')" class="invalid-feedback">
              <span *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</span>
              <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary" 
            [disabled]="registerForm.invalid || isLoading"
            style="width: 100%; margin-bottom: 1.5rem; padding: 0.875rem;">
            {{isLoading ? 'Creating Account...' : 'Create Account'}}
          </button>
        </form>

        <div style="text-align: center; margin-top: 1.5rem;">
          <p style="color: var(--gray-600); margin-bottom: 1rem;">Already have an account?</p>
          <a routerLink="/auth/login" class="btn btn-outline" style="width: 100%; padding: 0.875rem;">
            Sign In
          </a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/jobs']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}