"use client";

import React from "react";
import { Application, Status } from "@/types";
import {
  Briefcase,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  FileText,
} from "lucide-react";

interface KanbanBoardProps {
  applications: Application[];
  isLoading: boolean;
  onView: (app: Application) => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  onStatusChange: (app: Application, newStatus: Status) => void;
}

const COLUMNS: { status: Status; title: string; color: string; badgeBg: string }[] = [
  { status: "Applied", title: "Applied", color: "border-blue-500/40 bg-blue-500/5", badgeBg: "bg-blue-500/20 text-blue-300" },
  { status: "Interviewing", title: "Interviewing", color: "border-amber-500/40 bg-amber-500/5", badgeBg: "bg-amber-500/20 text-amber-300" },
  { status: "Offer", title: "Offer Received", color: "border-emerald-500/40 bg-emerald-500/5", badgeBg: "bg-emerald-500/20 text-emerald-300" },
  { status: "Rejected", title: "Closed / Rejected", color: "border-rose-500/40 bg-rose-500/5", badgeBg: "bg-rose-500/20 text-rose-300" },
];

export default function KanbanBoard({
  applications,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: KanbanBoardProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-96 rounded-xl border border-slate-800 bg-slate-900/50 p-4 animate-pulse">
            <div className="h-6 w-1/2 bg-slate-800 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-24 bg-slate-800/60 rounded-lg"></div>
              <div className="h-24 bg-slate-800/60 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
      {COLUMNS.map((col) => {
        const colApps = applications.filter((app) => app.status === col.status);

        return (
          <div
            key={col.status}
            className={`flex flex-col rounded-xl border ${col.color} bg-slate-900/80 p-3 shadow-inner min-h-[500px]`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1 pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                {col.title}
              </h3>
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${col.badgeBg}`}>
                {colApps.length}
              </span>
            </div>

            {/* Cards List */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
              {colApps.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-800 p-4 text-center">
                  <p className="text-xs text-slate-500 font-medium">No applications</p>
                </div>
              ) : (
                colApps.map((app) => (
                  <div
                    key={app.id}
                    className="group relative rounded-lg border border-slate-800 bg-slate-950 p-3.5 shadow-md hover:border-slate-700 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                          {app.company_name}
                        </h4>
                        <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mt-0.5">
                          <Briefcase size={12} className="text-slate-400" />
                          {app.job_title}
                        </p>
                      </div>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700">
                        {app.job_type}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(app.applied_date).toLocaleDateString()}
                      </span>
                      {app.notes && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <FileText size={11} />
                          Note
                        </span>
                      )}
                    </div>

                    {/* Quick Move & Actions Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-slate-400">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onView(app)}
                          className="rounded p-1 hover:bg-slate-800 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => onEdit(app)}
                          className="rounded p-1 hover:bg-slate-800 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => onDelete(app)}
                          className="rounded p-1 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Status Selector */}
                      <select
                        value={app.status}
                        onChange={(e) => onStatusChange(app, e.target.value as Status)}
                        className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
