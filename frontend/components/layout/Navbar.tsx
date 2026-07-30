"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Briefcase,
  Plus,
  LayoutGrid,
  ListFilter,
  User as UserIcon,
  Lock,
  LogOut,
  Shield,
  CreditCard,
  FileText,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface NavbarProps {
  activeView: "table" | "kanban";
  onViewChange: (view: "table" | "kanban") => void;
  onOpenAddModal: () => void;
  onOpenProfileModal: () => void;
  onOpenAdminModal: () => void;
  onOpenTransactionModal: () => void;
  onOpenPrivacyModal: () => void;
}

export default function Navbar({
  activeView,
  onViewChange,
  onOpenAddModal,
  onOpenProfileModal,
  onOpenAdminModal,
  onOpenTransactionModal,
  onOpenPrivacyModal,
}: NavbarProps) {
  const { user, openAuthModal, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-md shadow-brand-500/20 ring-1 ring-white/20">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">
                  JobTracker<span className="text-brand-400">.io</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Job Search & Application Operations
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          {user && (
            <div className="hidden md:flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800">
              <button
                onClick={() => onViewChange("table")}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeView === "table"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <ListFilter size={14} />
                Table View
              </button>
              <button
                onClick={() => onViewChange("kanban")}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeView === "kanban"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <LayoutGrid size={14} />
                Kanban Board
              </button>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Pro Upgrade / Premium Insights */}
              <button
                onClick={onOpenTransactionModal}
                className="hidden lg:flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all shadow-sm"
              >
                <Sparkles size={14} className="text-amber-400" />
                Upgrade to Pro
              </button>

              {/* Add Application CTA */}
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:from-brand-500 hover:to-indigo-500 transition-all shadow-md shadow-brand-600/20 ring-1 ring-white/10"
              >
                <Plus size={15} />
                <span className="hidden sm:inline">Add Application</span>
              </button>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
                >
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 ring-1 ring-slate-700 font-bold text-brand-400">
                    {user.name.charAt(0).toUpperCase()}
                    {user.isMfaEnabled && (
                      <span
                        className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950"
                        title="2FA Active"
                      />
                    )}
                  </div>
                  <span className="hidden sm:block font-semibold">{user.name}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150 z-50 text-slate-200">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenProfileModal();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                      >
                        <UserIcon size={14} className="text-brand-400" />
                        Account Settings
                      </button>

                      {user.role === "ADMIN" && (
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onOpenAdminModal();
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium hover:bg-slate-800 text-amber-300 hover:text-amber-200 transition-colors"
                        >
                          <Shield size={14} />
                          Admin Console
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenTransactionModal();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                      >
                        <CreditCard size={14} className="text-indigo-400" />
                        Subscription Plan
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenPrivacyModal();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                      >
                        <FileText size={14} className="text-emerald-400" />
                        Privacy & Data
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal("login")}
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
              >
                <Lock size={13} />
                Sign In
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-brand-500 transition-all shadow-md shadow-brand-600/20"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
