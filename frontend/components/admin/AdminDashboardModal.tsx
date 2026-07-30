"use client";

import React, { useState, useEffect } from "react";
import { X, Shield, Users, FileText, Lock, Unlock, RefreshCw, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import { AuditLog } from "@/types";
import toast from "react-hot-toast";

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboardModal({ isOpen, onClose }: AdminDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<"users" | "logs">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.admin.getUsers();
      setUsers(res.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch user directory.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await api.admin.getLogs(1);
      setLogs(res.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch audit logs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (activeTab === "users") fetchUsers();
      if (activeTab === "logs") fetchLogs();
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleUnlockUser = async (userId: string) => {
    try {
      const res = await api.admin.unlockUser(userId);
      toast.success(res.message);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Unlock failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl ring-1 ring-white/10 text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 ring-1 ring-amber-500/30">
              <Shield className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Admin Security Console</h3>
              <p className="text-xs text-slate-400">System user management, account lockouts & live audit stream</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/30 px-6">
          <div className="flex gap-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("users")}
              className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "users"
                  ? "border-amber-400 text-amber-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users size={14} />
              User Accounts Directory ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "logs"
                  ? "border-amber-400 text-amber-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText size={14} />
              Security Audit Stream
            </button>
          </div>
          <button
            onClick={() => (activeTab === "users" ? fetchUsers() : fetchLogs())}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === "users" && (
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 uppercase text-slate-400 text-[10px] font-bold">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">2FA Status</th>
                    <th className="p-3">Lockout Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((u) => {
                    const isLocked = u.lockoutUntil && new Date(u.lockoutUntil) > new Date();
                    return (
                      <tr key={u.id} className="hover:bg-slate-800/40">
                        <td className="p-3">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </td>
                        <td className="p-3">
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${u.role === "ADMIN" ? "bg-amber-500/20 text-amber-300" : "bg-slate-800 text-slate-300"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3">
                          {u.isMfaEnabled ? (
                            <span className="text-emerald-400 font-medium flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Active
                            </span>
                          ) : (
                            <span className="text-slate-500">Disabled</span>
                          )}
                        </td>
                        <td className="p-3">
                          {isLocked ? (
                            <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 flex items-center gap-1 w-fit">
                              <Lock size={10} /> Locked ({u.failedLoginAttempts} failed)
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Clear</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {isLocked && (
                            <button
                              onClick={() => handleUnlockUser(u.id)}
                              className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500 flex items-center gap-1 ml-auto"
                            >
                              <Unlock size={11} /> Unlock Account
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        log.status === "SUCCESS"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : log.status === "WARNING"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}>
                        {log.status}
                      </span>
                      <span className="font-mono font-bold text-white">{log.action}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      User: {log.user?.email || log.userId || "System/Anonymous"} • IP: {log.ipAddress || "Unknown"}
                    </p>
                    {log.details && (
                      <pre className="text-[10px] font-mono text-slate-400 bg-slate-900 p-1.5 rounded border border-slate-800/80 max-w-xl truncate">
                        {log.details}
                      </pre>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
