export interface Job {
  id: number;
  title: string;
  companyName: string;
  description: string;
  datePosted: string;
  isActive: boolean;
}

export interface CreateJobRequest {
  title: string;
  companyName: string;
  description: string;
  isActive: boolean;
}

export interface UpdateJobRequest {
  title?: string;
  companyName?: string;
  description?: string;
  isActive?: boolean;
}