import { z } from "zod";

export const JobTypeSchema = z.enum(["Internship", "FullTime", "PartTime"]);
export const StatusSchema = z.enum(["Applied", "Interviewing", "Offer", "Rejected"]);

export const CreateApplicationSchema = z.object({
  company_name: z
    .string({ required_error: "Company name is required" })
    .min(2, "Company name must be at least 2 characters")
    .max(255),
  job_title: z
    .string({ required_error: "Job title is required" })
    .min(1, "Job title is required")
    .max(255),
  job_type: JobTypeSchema,
  status: StatusSchema.default("Applied"),
  applied_date: z
    .string({ required_error: "Applied date is required" })
    .datetime({ offset: true })
    .or(z.string().date()),
  notes: z.string().max(2000).optional(),
});

export const UpdateApplicationSchema = z.object({
  company_name: z.string().min(2).max(255).optional(),
  job_title: z.string().min(1).max(255).optional(),
  job_type: JobTypeSchema.optional(),
  status: StatusSchema.optional(),
  applied_date: z
    .string()
    .datetime({ offset: true })
    .or(z.string().date())
    .optional(),
  notes: z.string().max(2000).optional(),
});

export const ListQuerySchema = z.object({
  status: StatusSchema.optional(),
  search: z.string().max(255).optional(),
});
