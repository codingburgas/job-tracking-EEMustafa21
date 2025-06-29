import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" style="margin-top: 2rem;">
      <div *ngIf="job" class="card" style="padding: 2.5rem;">
        <div style="margin-bottom: 2rem;">
          <a routerLink="/jobs" class="nav-link" style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; color: var(--primary-600); font-weight: 500;">
            ← Back to Jobs
          </a>
          
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
            <div>
              <h1 style="font-size: 2.25rem; font-weight: 800; color: var(--gray-800); margin-bottom: 0.75rem; letter-spacing: -0.05em;">
                {{job.title}}
              </h1>
              <p style="font-size: 1.375rem; color: var(--primary-600); font-weight: 600; margin-bottom: 0.75rem;">
                {{job.companyName}}
              </p>
              <p style="color: var(--gray-500); font-weight: 500;">
                Posted {{formatDate(job.datePosted)}}
              </p>
            </div>
            <span class="badge" [class]="job.isActive ? 'badge-active' : 'badge-inactive'" style="font-size: 0.8rem;">
              {{job.isActive ? 'Active' : 'Inactive'}}
            </span>
          </div>
        </div>

        <div style="margin-bottom: 2.5rem;">
          <h2 style="font-size: 1.375rem; font-weight: 700; color: var(--gray-800); margin-bottom: 1.5rem;">
            Job Description
          </h2>
          <div style="background: var(--gray-50); padding: 2rem; border-radius: 1rem; border-left: 4px solid var(--primary-500);">
            <p style="color: var(--gray-700); line-height: 1.8; white-space: pre-line; font-size: 1rem;">
              {{job.description}}
            </p>
          </div>
        </div>

        <div *ngIf="successMessage" class="alert alert-success">
          {{successMessage}}
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger">
          {{errorMessage}}
        </div>

        <div style="display: flex; gap: 1rem; align-items: center; padding-top: 1.5rem; border-top: 1px solid var(--gray-200);">
          <ng-container *ngIf="isAuthenticated && !isAdmin && job.isActive">
            <button 
              (click)="applyForJob()" 
              class="btn btn-primary"
              [disabled]="hasApplied || isApplying"
              style="padding: 0.875rem 2rem; font-size: 1rem;">
              {{hasApplied ? 'Already Applied' : (isApplying ? 'Applying...' : 'Apply for this Job')}}
            </button>
            <span *ngIf="hasApplied" style="color: var(--success-600); font-weight: 500; font-size: 0.875rem;">
              ✓ Application submitted
            </span>
          </ng-container>
          
          <ng-container *ngIf="!isAuthenticated">
            <a routerLink="/auth/login" class="btn btn-primary" style="padding: 0.875rem 2rem; font-size: 1rem;">
              Login to Apply
            </a>
            <a routerLink="/auth/register" class="btn btn-outline" style="padding: 0.875rem 2rem; font-size: 1rem;">
              Create Account
            </a>
          </ng-container>

          <ng-container *ngIf="!job.isActive">
            <div style="color: var(--gray-500); font-style: italic; padding: 0.875rem; background: var(--gray-50); border-radius: 0.5rem;">
              This job posting is no longer active.
            </div>
          </ng-container>
        </div>
      </div>

      <div *ngIf="!job && !isLoading" style="text-align: center; padding: 6rem 0;">
        <div style="background: var(--gray-100); width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem;">
          <svg width="48" height="48" fill="var(--gray-400)" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h3 style="color: var(--gray-600); margin-bottom: 1rem; font-size: 1.25rem; font-weight: 600;">
          Job not found
        </h3>
        <a routerLink="/jobs" class="btn btn-primary">Back to Jobs</a>
      </div>
    </div>
  `
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  isLoading = true;
  isAuthenticated = false;
  isAdmin = false;
  hasApplied = false;
  isApplying = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isAdmin = this.authService.isAdmin();

    const jobId = Number(this.route.snapshot.paramMap.get('id'));
    if (jobId) {
      this.loadJob(jobId);
    }
  }

  loadJob(jobId: number): void {
    this.jobService.getJobById(jobId).subscribe({
      next: (job) => {
        this.job = job;
        this.isLoading = false;
        
        if (job && this.isAuthenticated && !this.isAdmin) {
          this.checkIfApplied(jobId);
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  checkIfApplied(jobId: number): void {
    this.applicationService.hasUserAppliedForJob(jobId).subscribe(hasApplied => {
      this.hasApplied = hasApplied;
    });
  }

  applyForJob(): void {
    if (!this.job) return;

    this.isApplying = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.applicationService.applyForJob(this.job.id).subscribe({
      next: () => {
        this.isApplying = false;
        this.hasApplied = true;
        this.successMessage = 'Application submitted successfully! You can view your application status in the "My Applications" section.';
      },
      error: (error) => {
        this.isApplying = false;
        this.errorMessage = error.error?.message || 'Failed to submit application. Please try again.';
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}