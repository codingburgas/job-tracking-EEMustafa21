import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { ApplicationService } from '../../../core/services/application.service';
import { Job } from '../../../core/models/job.model';
import { Application } from '../../../core/models/application.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" style="margin-top: 2rem;">
      <div style="margin-bottom: 3rem;">
        <h1 style="font-size: 2.25rem; font-weight: 800; color: var(--gray-800); margin-bottom: 0.75rem; letter-spacing: -0.05em;">
          Admin Dashboard
        </h1>
        <p style="color: var(--gray-600); font-size: 1.125rem;">
          Manage job postings and applications
        </p>
      </div>

      <!-- Stats Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 4rem;">
        <div class="card" style="padding: 2rem; text-align: center;">
          <div style="background: var(--primary-100); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
            <svg width="24" height="24" fill="var(--primary-600)" viewBox="0 0 24 24">
              <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
            </svg>
          </div>
          <h3 style="font-size: 2.5rem; font-weight: 800; color: var(--primary-600); margin-bottom: 0.5rem;">
            {{jobs.length}}
          </h3>
          <p style="color: var(--gray-600); font-weight: 500;">Total Jobs</p>
        </div>
        
        <div class="card" style="padding: 2rem; text-align: center;">
          <div style="background: var(--success-100); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
            <svg width="24" height="24" fill="var(--success-600)" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3 style="font-size: 2.5rem; font-weight: 800; color: var(--success-600); margin-bottom: 0.5rem;">
            {{getActiveJobsCount()}}
          </h3>
          <p style="color: var(--gray-600); font-weight: 500;">Active Jobs</p>
        </div>
        
        <div class="card" style="padding: 2rem; text-align: center;">
          <div style="background: var(--warning-100); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
            <svg width="24" height="24" fill="var(--warning-600)" viewBox="0 0 24 24">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V11h2.5c.83 0 1.5.67 1.5 1.5V18h2v4H4v-4z"/>
            </svg>
          </div>
          <h3 style="font-size: 2.5rem; font-weight: 800; color: var(--warning-600); margin-bottom: 0.5rem;">
            {{applications.length}}
          </h3>
          <p style="color: var(--gray-600); font-weight: 500;">Total Applications</p>
        </div>
      </div>

      <!-- Job Management -->
      <div style="margin-bottom: 4rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: var(--gray-800);">
            Job Management
          </h2>
          <a routerLink="/admin/jobs/new" class="btn btn-primary" style="padding: 0.875rem 1.5rem;">
            Create New Job
          </a>
        </div>

        <div class="card" style="overflow: hidden;">
          <div *ngIf="jobs.length === 0" style="padding: 3rem; text-align: center; color: var(--gray-500);">
            <div style="background: var(--gray-100); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
              <svg width="32" height="32" fill="var(--gray-400)" viewBox="0 0 24 24">
                <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
              </svg>
            </div>
            No jobs posted yet
          </div>
          
          <div *ngIf="jobs.length > 0" style="overflow-x: auto;">
            <table>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let job of jobs">
                  <td>
                    <div style="font-weight: 600; color: var(--gray-800);">{{job.title}}</div>
                  </td>
                  <td style="color: var(--gray-600);">{{job.companyName}}</td>
                  <td>
                    <span class="badge" [class]="job.isActive ? 'badge-active' : 'badge-inactive'">
                      {{job.isActive ? 'Active' : 'Inactive'}}
                    </span>
                  </td>
                  <td style="color: var(--gray-600);">{{formatDate(job.datePosted)}}</td>
                  <td>
                    <div style="display: flex; gap: 0.5rem;">
                      <a [routerLink]="['/admin/jobs/edit', job.id]" class="btn btn-outline" style="padding: 0.5rem 0.75rem; font-size: 0.8rem;">
                        Edit
                      </a>
                      <button (click)="toggleJobStatus(job)" class="btn" 
                        [class]="job.isActive ? 'btn-secondary' : 'btn-success'"
                        style="padding: 0.5rem 0.75rem; font-size: 0.8rem;">
                        {{job.isActive ? 'Deactivate' : 'Activate'}}
                      </button>
                      <button (click)="deleteJob(job.id)" class="btn btn-danger" style="padding: 0.5rem 0.75rem; font-size: 0.8rem;">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Applications Management -->
      <div>
        <h2 style="font-size: 1.75rem; font-weight: 700; color: var(--gray-800); margin-bottom: 2rem;">
          Application Management
        </h2>

        <div class="card" style="overflow: hidden;">
          <div *ngIf="applications.length === 0" style="padding: 3rem; text-align: center; color: var(--gray-500);">
            <div style="background: var(--gray-100); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
              <svg width="32" height="32" fill="var(--gray-400)" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            No applications received yet
          </div>
          
          <div *ngIf="applications.length > 0" style="overflow-x: auto;">
            <table>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Job Title</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let application of applications">
                  <td>
                    <div style="font-weight: 600; color: var(--gray-800);">{{application.user?.firstName}} {{application.user?.lastName}}</div>
                    <div style="font-size: 0.875rem; color: var(--gray-500);">{{application.user?.username}}</div>
                  </td>
                  <td>
                    <div style="font-weight: 600; color: var(--gray-800);">{{application.job?.title}}</div>
                    <div style="font-size: 0.875rem; color: var(--gray-500);">{{application.job?.companyName}}</div>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="getStatusBadgeClass(application.status)">
                      {{application.status}}
                    </span>
                  </td>
                  <td style="color: var(--gray-600);">{{formatDate(application.appliedAt)}}</td>
                  <td>
                    <select 
                      (change)="updateApplicationStatus(application.id, $event)"
                      [value]="application.status"
                      style="padding: 0.5rem; border: 2px solid var(--gray-200); border-radius: 0.5rem; font-size: 0.875rem; background: white;">
                      <option value="Submitted">Submitted</option>
                      <option value="Selected for Interview">Selected for Interview</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  jobs: Job[] = [];
  applications: Application[] = [];

  constructor(
    private jobService: JobService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.loadJobs();
    this.loadApplications();
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe(jobs => {
      this.jobs = jobs;
    });
  }

  loadApplications(): void {
    this.applicationService.getAllApplications().subscribe(applications => {
      this.applications = applications;
    });
  }

  getActiveJobsCount(): number {
    return this.jobs.filter(job => job.isActive).length;
  }

  toggleJobStatus(job: Job): void {
    this.jobService.updateJob(job.id, { isActive: !job.isActive }).subscribe(() => {
      this.loadJobs();
    });
  }

  deleteJob(jobId: number): void {
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      this.jobService.deleteJob(jobId).subscribe(() => {
        this.loadJobs();
      });
    }
  }

  updateApplicationStatus(applicationId: number, event: any): void {
    const newStatus = event.target.value;
    this.applicationService.updateApplicationStatus(applicationId, newStatus).subscribe(() => {
      this.loadApplications();
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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}