"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  companyName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  companyName,
  onConfirm,
  onCancel,
  isDeleting,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-slide-up">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-4 mb-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="text-red-600" size={22} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Delete Application
            </h2>
            <p className="text-sm text-slate-500">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to delete your application to{" "}
          <span className="font-semibold text-slate-900">{companyName}</span>?
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isDeleting ? (
              <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : null}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
