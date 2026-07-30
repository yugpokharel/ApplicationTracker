export type JobType = "Internship" | "FullTime" | "PartTime";
export type Status = "Applied" | "Interviewing" | "Offer" | "Rejected";
export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isMfaEnabled: boolean;
  createdAt?: string;
  stats?: {
    totalApplications: number;
    auditLogCount: number;
  };
}

export interface Application {
  id: string;
  userId?: string;
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: Status;
  applied_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationInput {
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: Status;
  applied_date: string;
  notes?: string;
}

export interface UpdateApplicationInput {
  company_name?: string;
  job_title?: string;
  job_type?: JobType;
  status?: Status;
  applied_date?: string;
  notes?: string;
}

export interface ApplicationFilters {
  status?: Status;
  search?: string;
}

export interface AuditLog {
  id: string;
  userId?: string | null;
  action: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  status: "SUCCESS" | "FAILURE" | "WARNING";
  details?: string | null;
  createdAt: string;
  user?: {
    email: string;
    name: string;
    role: Role;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  idempotencyKey: string;
  status: string;
  hmacSignature: string;
  description?: string;
  createdAt: string;
}

export interface MfaSetupResponse {
  secret: string;
  otpauthUrl: string;
  qrCodeUrl: string;
  backupCodes: string[];
}
