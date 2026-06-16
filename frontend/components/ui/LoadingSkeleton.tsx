"use client";

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      <td className="px-6 py-4">
        <div className="h-4 w-36 rounded bg-slate-200 animate-pulse-soft" />
        <div className="h-3 w-24 rounded bg-slate-100 animate-pulse-soft mt-1.5" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-28 rounded bg-slate-200 animate-pulse-soft" />
      </td>
      <td className="px-6 py-4">
        <div className="h-5 w-20 rounded-full bg-slate-200 animate-pulse-soft" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-24 rounded bg-slate-200 animate-pulse-soft" />
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <div className="h-7 w-14 rounded bg-slate-200 animate-pulse-soft" />
          <div className="h-7 w-14 rounded bg-slate-200 animate-pulse-soft" />
          <div className="h-7 w-14 rounded bg-slate-200 animate-pulse-soft" />
        </div>
      </td>
    </tr>
  );
}

interface LoadingSkeletonProps {
  rows?: number;
}

export default function LoadingSkeleton({ rows = 6 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </>
  );
}
