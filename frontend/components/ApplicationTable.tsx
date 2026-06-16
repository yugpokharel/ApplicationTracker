"use client";

import { Application } from "@/types";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { Eye, Pencil, Trash2, FileX } from "lucide-react";

interface ApplicationTableProps {
  applications: Application[];
  isLoading: boolean;
  onView: (app: Application) => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
}

const jobTypeLabels: Record<string, string> = {
  FullTime: "Full-time",
  Internship: "Internship",
  PartTime: "Part-time",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ApplicationTable({
  applications,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: ApplicationTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80">
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Company / Role
            </th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Type
            </th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Status
            </th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Applied
            </th>
            <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <LoadingSkeleton rows={6} />
          ) : applications.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-20 text-center">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <FileX size={40} strokeWidth={1.5} />
                  <p className="text-sm font-medium">No applications found</p>
                  <p className="text-xs">Add your first application to get started</p>
                </div>
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr
                key={app.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900">{app.company_name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{app.job_title}</p>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {jobTypeLabels[app.job_type] ?? app.job_type}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {formatDate(app.applied_date)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(app)}
                      title="View"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(app)}
                      title="Edit"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(app)}
                      title="Delete"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
