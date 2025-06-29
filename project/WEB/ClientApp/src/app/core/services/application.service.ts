import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../models/application.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) {}

  applyForJob(jobId: number): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/apply/${jobId}`, {});
  }

  getUserApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/my-applications`);
  }

  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/all`);
  }

  updateApplicationStatus(applicationId: number, status: string): Observable<Application> {
    return this.http.put<Application>(`${this.apiUrl}/${applicationId}/status`, { status });
  }

  hasUserAppliedForJob(jobId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check/${jobId}`);
  }
}