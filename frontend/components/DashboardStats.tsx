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
  const interviewing = applications.filter(
    (a) => a.status === "Interviewing"
  ).length;
  const offers = applications.filter((a) => a.status === "Offer").length;
  const rejected = applications.filter((a) => a.status === "Rejected").length;

  const stats = [
    {
      label: "Total",
      value: total,
      icon: Briefcase,
      color: "bg-slate-100 text-slate-600",
    },
    {
      label: "Applied",
      value: applied,
      icon: Clock,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Interviewing",
      value: interviewing,
      icon: MessageSquare,
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Offers",
      value: offers,
      icon: Trophy,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
      color: "bg-red-100 text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
          >
            <div
              className={`inline-flex h-9 w-9 items-center justify-center rounded-xl mb-3 ${stat.color}`}
            >
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
