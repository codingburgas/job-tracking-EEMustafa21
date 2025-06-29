import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApplicationService } from '../../../core/services/application.service';
import { Application } from '../../../core/models/application.model';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" style="margin-top: 2rem;">
      <div style="margin-bottom: 3rem;">
        <h1 style="font-size: 2.25rem; font-weight: 800; color: var(--gray-800); margin-bottom: 0.75rem; letter-spacing: -0.05em;">
          My Applications
        </h1>
        <p style="color: var(--gray-600); font-size: 1.125rem;">
          Track the status of your job applications
        </p>
      </div>

      <div style="display: grid; gap: 2rem;">
        <div *ngFor="let application of applications" class="card" style="padding: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
            <div style="flex: 1;">
              <h3 style="font-size: 1.375rem; font-weight: 700; color: var(--gray-800); margin-bottom: 0.75rem; letter-spacing: -0.025em;">
                {{application.job?.title}}
              </h3>
              <p style="color: var(--primary-600); font-weight: 600; margin-bottom: 0.5rem; font-size: 1.125rem;">
                {{application.job?.companyName}}
              </p>
              <p style="color: var(--gray-500); font-size: 0.875rem; font-weight: 500;">
                Applied {{formatDate(application.appliedAt)}}
              </p>
            </div>
            <span class="badge" [ngClass]="getStatusBadgeClass(application.status)" style="font-size: 0.8rem;">
              {{application.status}}
            </span>
          </div>

          <div style="display: flex; gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--gray-100);">
            <a [routerLink]="['/jobs', application.jobId]" class="btn btn-outline">
              View Job Details
            </a>
          </div>
        </div>
      </div>

      <div *ngIf="applications.length === 0" style="text-align: center; padding: 6rem 0;">
        <div style="background: var(--gray-100); width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem;">
          <svg width="48" height="48" fill="var(--gray-400)" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
        </div>
        <h3 style="color: var(--gray-600); margin-bottom: 1rem; font-size: 1.25rem; font-weight: 600;">
          No applications yet
        </h3>
        <p style="color: var(--gray-500); margin-bottom: 2rem;">
          Start applying for jobs to see your applications here.
        </p>
        <a routerLink="/jobs" class="btn btn-primary" style="padding: 0.875rem 2rem;">
          Browse Jobs
        </a>
      </div>
    </div>
  `
})
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.applicationService.getUserApplications().subscribe(applications => {
      this.applications = applications;
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Submitted':
        return 'badge-submitted';
      case 'Selected for Interview':
        return 'badge-interview';
      case 'Rejected':
        return 'badge-rejected';
      default:
        return 'badge-submitted';
    }
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