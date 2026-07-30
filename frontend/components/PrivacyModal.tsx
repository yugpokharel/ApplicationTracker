"use client";

import React from "react";
import { X, ShieldCheck, Lock, Database, FileText, CheckCircle2 } from "lucide-react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl ring-1 ring-white/10 text-white overflow-hidden p-6 max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 ring-1 ring-brand-500/30">
            <ShieldCheck className="h-6 w-6 text-brand-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Privacy Policy & Data Security</h3>
            <p className="text-xs text-slate-400">How we protect your user profile and application data</p>
          </div>
        </div>

        <div className="space-y-6 text-xs text-slate-300">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2 text-sm">
              <Lock size={15} className="text-brand-400" /> 1. Data Protection & Encryption
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Your personal data, login credentials, and job application notes are encrypted using industry-standard cryptography. Access to your job search records is strictly isolated to your authenticated account.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2 text-sm">
              <ShieldCheck size={15} className="text-emerald-400" /> 2. Account Security & Two-Factor Authentication
            </h4>
            <p className="text-slate-400 leading-relaxed">
              We enforce strict password standards and offer optional Multi-Factor Authentication (MFA / 2FA) using authenticator apps like Google Authenticator or Authy to ensure your account remains safe.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2 text-sm">
              <FileText size={15} className="text-indigo-400" /> 3. Data Portability & Rights
            </h4>
            <p className="text-slate-400 leading-relaxed">
              You maintain full ownership of your data. You can export a full backup copy of your applications at any time from your Account Settings, import backup files, or permanently delete your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
