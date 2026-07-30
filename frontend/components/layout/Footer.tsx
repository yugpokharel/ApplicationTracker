"use client";

import React from "react";
import { Briefcase, ShieldCheck, FileText, ExternalLink } from "lucide-react";

interface FooterProps {
  onOpenPrivacyModal: () => void;
}

export default function Footer({ onOpenPrivacyModal }: FooterProps) {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400 py-8 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6 pb-6 border-b border-slate-800/60">
          {/* Brand Col */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-brand-400" />
              <span className="font-bold text-white text-sm">JobTracker.io</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Track job applications, schedule interviews, and manage your career pipeline efficiently.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Dashboard & Stats
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Kanban Board
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Career Insights
                </a>
              </li>
            </ul>
          </div>

          {/* Privacy & Compliance */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Legal & Privacy
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={onOpenPrivacyModal}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <FileText size={12} className="text-brand-400" />
                  Privacy Policy & Data Rights
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Data Security Notice
                </a>
              </li>
            </ul>
          </div>

          {/* System Telemetry */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              System Status
            </h4>
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Platform Services</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  OPERATIONAL
                </span>
              </div>
              <p className="text-[10px] text-slate-500">All systems functioning normally.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© 2026 JobTracker.io. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenPrivacyModal} className="hover:text-slate-300 transition-colors">
              Privacy & Security
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
