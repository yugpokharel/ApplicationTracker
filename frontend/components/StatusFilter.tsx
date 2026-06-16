"use client";

import { Status } from "@/types";

interface StatusFilterProps {
  value: Status | "";
  onChange: (value: Status | "") => void;
}

const options: { value: Status | ""; label: string }[] = [
  { value: "", label: "All Status" },
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
      className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-brand-500 transition-colors cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
