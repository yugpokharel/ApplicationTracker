import { Request } from "express";

export type Role = "USER" | "ADMIN";
export type JobType = "Internship" | "FullTime" | "PartTime";
export type Status = "Applied" | "Interviewing" | "Offer" | "Rejected";

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
  isMfaEnabled: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export interface ApplicationEntity {
  id: string;
  userId: string;
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: Status;
  applied_date: Date;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateApplicationDTO {
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: Status;
  applied_date: string;
  notes?: string;
}

export interface UpdateApplicationDTO {
  company_name?: string;
  job_title?: string;
  job_type?: JobType;
  status?: Status;
  applied_date?: string;
  notes?: string;
}

export interface ListApplicationsQuery {
  status?: Status;
  search?: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
  total?: number;
}

export interface ApiErrorResponse {
  error: string;
  details?: string;
}
