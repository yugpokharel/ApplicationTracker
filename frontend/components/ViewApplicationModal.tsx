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
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl text-white overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div>
            <h2 className="text-base font-bold text-white">
              {application.company_name}
            </h2>
            <p className="text-xs text-slate-400">{application.job_title}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400">
              <Building2 size={16} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Company Name</p>
              <p className="text-xs text-white font-bold">{application.company_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Briefcase size={16} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Role & Position Type</p>
              <p className="text-xs text-white font-bold">
                {application.job_title} ·{" "}
                <span className="text-slate-300 font-normal">
                  {jobTypeLabels[application.job_type] ?? application.job_type}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Calendar size={16} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Applied Date</p>
              <p className="text-xs text-white font-mono font-medium">
                {formatDate(application.applied_date)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <span className="text-xs font-bold">S</span>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Application Status</p>
              <StatusBadge status={application.status} />
            </div>
          </div>

          {application.notes && (
            <div className="flex items-start gap-3 pt-2 border-t border-slate-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 shrink-0">
                <StickyNote size={16} />
              </div>
              <div className="space-y-1 w-full">
                <p className="text-[11px] text-slate-400 font-bold">
                  Notes:
                </p>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-sans">
                  {application.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(application)}
            className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-500"
          >
            Edit Application
          </button>
        </div>
      </div>
    </div>
  );
}
