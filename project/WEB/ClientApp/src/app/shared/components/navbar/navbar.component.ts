import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <a routerLink="/" class="navbar-brand">JobPortal</a>
          
          <div class="navbar-nav">
            <a routerLink="/jobs" routerLinkActive="active" class="nav-link">Jobs</a>
            
            <ng-container *ngIf="currentUser$ | async as user; else guestMenu">
              <ng-container *ngIf="user.role === 'USER'">
                <a routerLink="/applications" routerLinkActive="active" class="nav-link">My Applications</a>
              </ng-container>
              
              <ng-container *ngIf="user.role === 'ADMIN'">
                <a routerLink="/admin" routerLinkActive="active" class="nav-link">Admin Panel</a>
              </ng-container>
              
              <div style="display: flex; align-items: center; gap: 1rem; margin-left: 1rem; padding-left: 1rem; border-left: 1px solid var(--gray-200);">
                <span style="color: var(--gray-600); font-size: 0.875rem; font-weight: 500;">
                  Welcome, {{user.firstName}}
                </span>
                <button (click)="logout()" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                  Logout
                </button>
              </div>
            </ng-container>
            
            <ng-template #guestMenu>
              <a routerLink="/auth/login" routerLinkActive="active" class="nav-link">Login</a>
              <a routerLink="/auth/register" class="btn btn-primary" style="margin-left: 1rem; padding: 0.5rem 1rem; font-size: 0.8rem;">
                Register
              </a>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  currentUser$ = this.authService.currentUser$;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/jobs']);
  }
}