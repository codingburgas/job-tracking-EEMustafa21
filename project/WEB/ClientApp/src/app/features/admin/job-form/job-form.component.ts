import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container" style="margin-top: 2rem; max-width: 800px;">
      <div class="card" style="padding: 2.5rem;">
        <div style="margin-bottom: 2rem;">
          <a routerLink="/admin" class="nav-link" style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; color: var(--primary-600); font-weight: 500;">
            ← Back to Dashboard
          </a>
          
          <h1 style="font-size: 2rem; font-weight: 800; color: var(--gray-800); letter-spacing: -0.025em;">
            {{isEditMode ? 'Edit Job' : 'Create New Job'}}
          </h1>
        </div>

        <div *ngIf="successMessage" class="alert alert-success">
          {{successMessage}}
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger">
          {{errorMessage}}
        </div>

        <form [formGroup]="jobForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Job Title *</label>
            <input 
              type="text" 
              class="form-control"
              [class.is-invalid]="isFieldInvalid('title')"
              formControlName="title"
              placeholder="e.g. Senior Frontend Developer">
            <div *ngIf="isFieldInvalid('title')" class="invalid-feedback">
              Job title is required
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Company Name *</label>
            <input 
              type="text" 
              class="form-control"
              [class.is-invalid]="isFieldInvalid('companyName')"
              formControlName="companyName"
              placeholder="e.g. TechCorp Solutions">
            <div *ngIf="isFieldInvalid('companyName')" class="invalid-feedback">
              Company name is required
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Job Description *</label>
            <textarea 
              class="form-control"
              [class.is-invalid]="isFieldInvalid('description')"
              formControlName="description"
              rows="8"
              placeholder="Provide a detailed description of the job role, responsibilities, requirements, and qualifications..."
              style="resize: vertical;"></textarea>
            <div *ngIf="isFieldInvalid('description')" class="invalid-feedback">
              <span *ngIf="jobForm.get('description')?.errors?.['required']">Job description is required</span>
              <span *ngIf="jobForm.get('description')?.errors?.['minlength']">Description must be at least 50 characters</span>
            </div>
          </div>

          <div class="form-group">
            <div style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: var(--gray-50); border-radius: 0.75rem;">
              <input 
                type="checkbox" 
                id="isActive"
                formControlName="isActive"
                style="width: 1.25rem; height: 1.25rem; accent-color: var(--primary-600);">
              <label for="isActive" class="form-label" style="margin-bottom: 0; cursor: pointer;">
                Job is Active (visible to job seekers)
              </label>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--gray-200);">
            <button 
              type="submit" 
              class="btn btn-primary" 
              [disabled]="jobForm.invalid || isLoading"
              style="padding: 0.875rem 2rem;">
              {{isLoading ? 'Saving...' : (isEditMode ? 'Update Job' : 'Create Job')}}
            </button>
            <a routerLink="/admin" class="btn btn-secondary" style="padding: 0.875rem 2rem;">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class JobFormComponent implements OnInit {
  jobForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  jobId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      companyName: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(50)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.jobId = Number(id);
      this.loadJob(this.jobId);
    }
  }

  loadJob(id: number): void {
    this.jobService.getJobById(id).subscribe({
      next: (job) => {
        this.jobForm.patchValue({
          title: job.title,
          companyName: job.companyName,
          description: job.description,
          isActive: job.isActive
        });
      },
      error: () => {
        this.errorMessage = 'Job not found';
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 2000);
      }
    });
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const jobData = this.jobForm.value;

      if (this.isEditMode && this.jobId) {
        this.jobService.updateJob(this.jobId, jobData).subscribe({
          next: () => {
            this.isLoading = false;
            this.successMessage = 'Job updated successfully!';
            setTimeout(() => {
              this.router.navigate(['/admin']);
            }, 1500);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Failed to update job. Please try again.';
          }
        });
      } else {
        this.jobService.createJob(jobData).subscribe({
          next: () => {
            this.isLoading = false;
            this.successMessage = 'Job created successfully!';
            setTimeout(() => {
              this.router.navigate(['/admin']);
            }, 1500);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Failed to create job. Please try again.';
          }
        });
      }
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.jobForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}