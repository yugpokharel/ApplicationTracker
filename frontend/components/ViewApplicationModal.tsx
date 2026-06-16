"use client";

import { X, Building2, Briefcase, Calendar, StickyNote } from "lucide-react";
import { Application } from "@/types";
import StatusBadge from "@/components/ui/StatusBadge";

interface ViewApplicationModalProps {
  application: Application | null;
  onClose: () => void;
  onEdit: (app: Application) => void;
}

const jobTypeLabels: Record<string, string> = {
  FullTime: "Full-time",
  Internship: "Internship",
  PartTime: "Part-time",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ViewApplicationModal({
  application,
  onClose,
  onEdit,
}: ViewApplicationModalProps) {
  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {application.company_name}
            </h2>
            <p className="text-sm text-slate-500">{application.job_title}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Building2 size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Company</p>
              <p className="text-sm text-slate-900 font-medium">
                {application.company_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Briefcase size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Role & Type</p>
              <p className="text-sm text-slate-900 font-medium">
                {application.job_title} ·{" "}
                {jobTypeLabels[application.job_type] ?? application.job_type}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Applied On</p>
              <p className="text-sm text-slate-900 font-medium">
                {formatDate(application.applied_date)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <span className="text-xs font-bold">S</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Status</p>
              <StatusBadge status={application.status} />
            </div>
          </div>

          {application.notes && (
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 shrink-0">
                <StickyNote size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">Notes</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {application.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(application)}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
