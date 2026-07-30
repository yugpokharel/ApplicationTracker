"use client";

import { Application } from "@/types";
import {
  Briefcase,
  Clock,
  MessageSquare,
  Trophy,
  XCircle,
} from "lucide-react";

interface DashboardStatsProps {
  applications: Application[];
}

export default function DashboardStats({ applications }: DashboardStatsProps) {
  const total = applications.length;
  const applied = applications.filter((a) => a.status === "Applied").length;
  const interviewing = applications.filter((a) => a.status === "Interviewing").length;
  const offers = applications.filter((a) => a.status === "Offer").length;
  const rejected = applications.filter((a) => a.status === "Rejected").length;

  const stats = [
    {
      label: "Total Applications",
      value: total,
      icon: Briefcase,
      color: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
    },
    {
      label: "Applied",
      value: applied,
      icon: Clock,
      color: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    },
    {
      label: "Interviewing",
      value: interviewing,
      icon: MessageSquare,
      color: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    },
    {
      label: "Offers Received",
      value: offers,
      icon: Trophy,
      color: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    },
    {
      label: "Closed / Rejected",
      value: rejected,
      icon: XCircle,
      color: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4 shadow-lg hover:border-slate-700 transition-all"
          >
            <div
              className={`inline-flex h-9 w-9 items-center justify-center rounded-xl mb-3 ${stat.color}`}
            >
              <Icon size={18} />
            </div>
            <p className="text-2xl font-extrabold text-white tracking-tight">{stat.value}</p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
