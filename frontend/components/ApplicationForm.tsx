"use client";

import { useState, useEffect, FormEvent } from "react";
import { X } from "lucide-react";
import { Application, CreateApplicationInput, JobType, Status } from "@/types";
import { api } from "@/lib/api";

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingApplication?: Application | null;
}

const defaultForm: CreateApplicationInput = {
  company_name: "",
  job_title: "",
  job_type: "FullTime",
  status: "Applied",
  applied_date: new Date().toISOString().split("T")[0],
  notes: "",
};

const jobTypeOptions: { value: JobType; label: string }[] = [
  { value: "FullTime", label: "Full-time" },
  { value: "Internship", label: "Internship" },
  { value: "PartTime", label: "Part-time" },
];

const statusOptions: { value: Status; label: string }[] = [
  { value: "Applied", label: "Applied" },
  { value: "Interviewing", label: "Interviewing" },
  { value: "Offer", label: "Offer" },
  { value: "Rejected", label: "Rejected" },
];

export default function ApplicationForm({
  isOpen,
  onClose,
  onSuccess,
  editingApplication,
}: ApplicationFormProps) {
  const [form, setForm] = useState<CreateApplicationInput>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateApplicationInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingApplication) {
      setForm({
        company_name: editingApplication.company_name,
        job_title: editingApplication.job_title,
        job_type: editingApplication.job_type,
        status: editingApplication.status,
        applied_date: editingApplication.applied_date.split("T")[0],
        notes: editingApplication.notes ?? "",
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [editingApplication, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateApplicationInput, string>> = {};
    if (form.company_name.trim().length < 2) {
      newErrors.company_name = "Company name must be at least 2 characters";
    }
    if (!form.job_title.trim()) {
      newErrors.job_title = "Job title is required";
    }
    if (!form.applied_date) {
      newErrors.applied_date = "Applied date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (editingApplication) {
        await api.applications.update(editingApplication.id, form);
      } else {
        await api.applications.create(form);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setErrors({
        company_name: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">
            {editingApplication ? "Edit Application" : "Add Application"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              placeholder="e.g. Google"
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none transition-colors ${
                errors.company_name ? "border-red-400" : "border-slate-200 focus:border-brand-500"
              }`}
            />
            {errors.company_name && (
              <p className="mt-1 text-xs text-red-500">{errors.company_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.job_title}
              onChange={(e) => setForm({ ...form, job_title: e.target.value })}
              placeholder="e.g. Software Engineer"
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none transition-colors ${
                errors.job_title ? "border-red-400" : "border-slate-200 focus:border-brand-500"
              }`}
            />
            {errors.job_title && (
              <p className="mt-1 text-xs text-red-500">{errors.job_title}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Type</label>
              <select
                value={form.job_type}
                onChange={(e) => setForm({ ...form, job_type: e.target.value as JobType })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 transition-colors"
              >
                {jobTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 transition-colors"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Applied Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.applied_date}
              onChange={(e) => setForm({ ...form, applied_date: e.target.value })}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none transition-colors ${
                errors.applied_date ? "border-red-400" : "border-slate-200 focus:border-brand-500"
              }`}
            />
            {errors.applied_date && (
              <p className="mt-1 text-xs text-red-500">{errors.applied_date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              placeholder="Any relevant notes about this application..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 transition-colors resize-none"
            />
          </div>
        </form>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isSubmitting && (
              <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            )}
            {isSubmitting ? "Saving..." : editingApplication ? "Save Changes" : "Add Application"}
          </button>
        </div>
      </div>
    </div>
  );
}
