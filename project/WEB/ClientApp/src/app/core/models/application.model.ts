export interface Application {
  id: number;
  userId: number;
  jobId: number;
  status: 'Submitted' | 'Selected for Interview' | 'Rejected';
  appliedAt: string;
  job?: Job;
  user?: User;
}

export interface Job {
  id: number;
  title: string;
  companyName: string;
  description: string;
  datePosted: string;
  isActive: boolean;
}

export interface User {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  role: string;
}