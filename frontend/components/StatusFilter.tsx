"use client";

import { Status } from "@/types";

interface StatusFilterProps {
  value: Status | "";
  onChange: (value: Status | "") => void;
}

const options: { value: Status | ""; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "Applied", label: "Applied" },
  { value: "Interviewing", label: "Interviewing" },
  { value: "Offer", label: "Offer" },
  { value: "Rejected", label: "Rejected" },
];

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Status | "")}
      className="h-10 rounded-xl border border-slate-800 bg-slate-900 px-3 text-xs font-semibold text-slate-300 outline-none focus:border-brand-500 transition-colors cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
          {opt.label}
        </option>
      ))}
    </select>
  );
}
