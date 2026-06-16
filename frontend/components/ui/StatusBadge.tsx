import { Status } from "@/types";

interface StatusBadgeProps {
  status: Status;
}

const statusConfig: Record<Status, { label: string; classes: string }> = {
  Applied: {
    label: "Applied",
    classes: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  },
  Interviewing: {
    label: "Interviewing",
    classes: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  },
  Offer: {
    label: "Offer",
    classes: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  },
  Rejected: {
    label: "Rejected",
    classes: "bg-red-100 text-red-600 ring-1 ring-red-200",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
