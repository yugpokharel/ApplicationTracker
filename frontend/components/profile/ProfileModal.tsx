"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User as UserIcon,
  Shield,
  KeyRound,
  Download,
  Upload,
  Trash2,
  Lock,
  QrCode,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { MfaSetupResponse } from "@/types";
import toast from "react-hot-toast";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "gdpr">("profile");

  // Profile Form
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Password Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // MFA Setup
  const [mfaData, setMfaData] = useState<MfaSetupResponse | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [isSettingUpMfa, setIsSettingUpMfa] = useState(false);

  // Import State
  const [importJsonText, setImportJsonText] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.profile.update({ name, email });
      toast.success("Profile updated successfully!");
      refreshUser();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.profile.changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to change password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartMfaSetup = async () => {
    setIsSettingUpMfa(true);
    try {
      const res = await api.auth.mfaSetup();
      setMfaData(res.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize MFA setup.");
      setIsSettingUpMfa(false);
    }
  };

  const handleVerifyAndEnableMfa = async () => {
    if (!mfaData || !mfaCode) return;
    setIsLoading(true);
    try {
      await api.auth.mfaVerify(mfaData.secret, mfaCode);
      toast.success("Multi-Factor Authentication enabled!");
      setMfaData(null);
      setIsSettingUpMfa(false);
      refreshUser();
    } catch (err: any) {
      toast.error(err.message || "Invalid 6-digit MFA verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    if (!confirm("Are you sure you want to disable 2FA?")) return;
    try {
      await api.auth.mfaDisable();
      toast.success("MFA disabled.");
      refreshUser();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleExportData = async () => {
    try {
      const res = await api.profile.exportData();
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `job_tracker_gdpr_export_${user.id.slice(0, 8)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("GDPR Data Export downloaded!");
    } catch (err: any) {
      toast.error(err.message || "Data export failed.");
    }
  };

  const handleImportData = async () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const apps = Array.isArray(parsed) ? parsed : parsed.applications;
      if (!apps || !Array.isArray(apps)) {
        throw new Error("Invalid JSON format. Must contain an array of applications.");
      }

      const res = await api.profile.importData(apps);
      toast.success(res.message);
      setImportJsonText("");
      refreshUser();
    } catch (err: any) {
      toast.error(err.message || "Data import failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl ring-1 ring-white/10 text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600/20 ring-1 ring-brand-500/30">
              <UserIcon className="h-5 w-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Account & Security Settings</h3>
              <p className="text-xs text-slate-400">Manage credentials, 2FA, and GDPR privacy options</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "profile"
                ? "border-brand-500 text-brand-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <UserIcon size={14} />
            Personal Details
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "security"
                ? "border-brand-500 text-brand-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Shield size={14} />
            Security & 2FA
          </button>
          <button
            onClick={() => setActiveTab("gdpr")}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "gdpr"
                ? "border-brand-500 text-brand-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Download size={14} />
            GDPR & Data Portability
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* TAB 1: PROFILE */}
          {activeTab === "profile" && (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-500 transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SECURITY & 2FA */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Password Change */}
              <form onSubmit={handleChangePassword} className="space-y-3 pb-6 border-b border-slate-800">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Lock size={14} className="text-brand-400" /> Change Password
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 py-1.5 px-3 text-xs text-white focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">New Password (Min 10 Chars)</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 py-1.5 px-3 text-xs text-white focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
                >
                  Update Password
                </button>
              </form>

              {/* MFA / 2FA Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <QrCode size={14} className="text-emerald-400" /> Multi-Factor Authentication (MFA / 2FA)
                    </h4>
                    <p className="text-[11px] text-slate-400">Protect account with Google Authenticator or Authy</p>
                  </div>
                  {user.isMfaEnabled ? (
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">
                      Enabled
                    </span>
                  ) : (
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300">
                      Disabled
                    </span>
                  )}
                </div>

                {user.isMfaEnabled ? (
                  <button
                    onClick={handleDisableMfa}
                    className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors"
                  >
                    Disable 2FA
                  </button>
                ) : !isSettingUpMfa ? (
                  <button
                    onClick={handleStartMfaSetup}
                    className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
                  >
                    Set Up 2FA Authenticator
                  </button>
                ) : mfaData ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                    <p className="text-xs text-slate-300">1. Scan this QR Code in Google Authenticator or Authy:</p>
                    <div className="flex items-center gap-4 bg-white p-3 rounded-lg w-fit">
                      <img src={mfaData.qrCodeUrl} alt="TOTP QR Code" className="h-32 w-32" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 mb-1">Manual Secret Key:</p>
                      <code className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-xs font-mono text-emerald-400 select-all">
                        {mfaData.secret}
                      </code>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-slate-300 mb-1.5">2. Enter 6-digit code to verify:</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={mfaCode}
                          onChange={(e) => setMfaCode(e.target.value)}
                          placeholder="123456"
                          className="w-32 rounded-lg border border-slate-800 bg-slate-900 py-1.5 text-center text-xs font-mono text-emerald-400 focus:outline-none"
                        />
                        <button
                          onClick={handleVerifyAndEnableMfa}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
                        >
                          Verify & Activate
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* TAB 3: GDPR & DATA PORTABILITY */}
          {activeTab === "gdpr" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Download size={15} className="text-indigo-400" /> Export Personal Data (GDPR Article 20)
                </h4>
                <p className="text-xs text-slate-400">
                  Download a complete, machine-readable JSON archive of your user profile, job tracker history, and security log metadata.
                </p>
                <button
                  onClick={handleExportData}
                  className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 transition-colors"
                >
                  Download GDPR Export (.JSON)
                </button>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Upload size={15} className="text-emerald-400" /> Import Job Tracker Data
                </h4>
                <p className="text-xs text-slate-400">
                  Paste a previously exported JSON array of application items to restore or batch-import applications:
                </p>
                <textarea
                  rows={3}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder='[{"company_name": "Google", "job_title": "Senior Dev", "job_type": "FullTime", "status": "Applied"}]'
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs font-mono text-slate-200 focus:outline-none"
                />
                <button
                  onClick={handleImportData}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
                >
                  Execute Import
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
