import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" style="margin-top: 2rem;">
      <div style="text-align: center; margin-bottom: 4rem;">
        <h1 style="font-size: 3rem; font-weight: 800; background: linear-gradient(135deg, var(--gray-800) 0%, var(--primary-600) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 1rem; letter-spacing: -0.05em;">
          Find Your Dream Job
        </h1>
        <p style="font-size: 1.25rem; color: var(--gray-600); max-width: 600px; margin: 0 auto; line-height: 1.7;">
          Discover amazing opportunities at top companies. Start your career journey today.
        </p>
      </div>

      <div style="margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2 style="font-size: 1.5rem; font-weight: 600; color: var(--gray-800);">
            Available Positions
          </h2>
          <span style="background: var(--primary-100); color: var(--primary-700); padding: 0.5rem 1rem; border-radius: 9999px; font-weight: 600; font-size: 0.875rem;">
            {{jobs.length}} Jobs Available
          </span>
        </div>
      </div>

      <div style="display: grid; gap: 2rem;">
        <div *ngFor="let job of jobs" class="card" style="padding: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
            <div style="flex: 1;">
              <h3 style="font-size: 1.375rem; font-weight: 700; color: var(--gray-800); margin-bottom: 0.75rem; letter-spacing: -0.025em;">
                {{job.title}}
              </h3>
              <p style="color: var(--primary-600); font-weight: 600; margin-bottom: 0.5rem; font-size: 1.125rem;">
                {{job.companyName}}
              </p>
              <p style="color: var(--gray-500); font-size: 0.875rem; font-weight: 500;">
                Posted {{formatDate(job.datePosted)}}
              </p>
            </div>
            <span class="badge badge-active" style="font-size: 0.8rem;">Active</span>
          </div>

          <p style="color: var(--gray-600); margin-bottom: 2rem; line-height: 1.7; font-size: 1rem;">
            {{getJobExcerpt(job.description)}}
          </p>

          <div style="display: flex; gap: 1rem; align-items: center;">
            <a [routerLink]="['/jobs', job.id]" class="btn btn-primary">
              View Details
            </a>
            <ng-container *ngIf="isAuthenticated && !isAdmin">
              <a [routerLink]="['/jobs', job.id]" class="btn btn-outline">
                Apply Now
              </a>
            </ng-container>
          </div>
        </div>
      </div>

      <div *ngIf="jobs.length === 0" style="text-align: center; padding: 6rem 0;">
        <div style="background: var(--gray-100); width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem;">
          <svg width="48" height="48" fill="var(--gray-400)" viewBox="0 0 24 24">
            <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
          </svg>
        </div>
        <h3 style="color: var(--gray-600); margin-bottom: 1rem; font-size: 1.25rem; font-weight: 600;">
          No jobs available at the moment
        </h3>
        <p style="color: var(--gray-500); margin-bottom: 2rem;">
          Please check back later for new opportunities.
        </p>
      </div>
    </div>
  `
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  isAuthenticated = false;
  isAdmin = false;

  constructor(
    private jobService: JobService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isAdmin = this.authService.isAdmin();
    
    this.jobService.getActiveJobs().subscribe(jobs => {
      this.jobs = jobs;
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

  getJobExcerpt(description: string): string {
    return description.length > 200 
      ? description.substring(0, 200) + '...'
      : description;
  }
}