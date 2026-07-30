"use client";

import React, { useState } from "react";
import { X, Lock, Mail, User as UserIcon, ShieldCheck, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, login } = useAuth();

  const [mode, setMode] = useState<"login" | "register" | "mfa">(authModalMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync mode state when modal opens
  React.useEffect(() => {
    setMode(authModalMode);
    setErrorMsg(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  // Password Policy checklist calculations
  const hasMinLength = password.length >= 10;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const passScore = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (mode === "register") {
        const res = await api.auth.register({ email, password, name });
        login(res.data.token, res.data.user);
      } else if (mode === "login") {
        const res = await api.auth.login({ email, password });
        if (res.mfaRequired) {
          setMode("mfa");
          toast("Multi-Factor Authentication required.", { icon: "🔐" });
        } else if (res.data) {
          login(res.data.token, res.data.user);
        }
      } else if (mode === "mfa") {
        const res = await api.auth.login({ email, password, mfaCode });
        if (res.data) {
          login(res.data.token, res.data.user);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl ring-1 ring-white/10 text-white">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 shadow-md shadow-brand-500/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {mode === "register"
                ? "Create Account"
                : mode === "mfa"
                ? "Two-Factor Verification"
                : "Welcome Back"}
            </h3>
            <p className="text-xs text-slate-400">
              {mode === "register"
                ? "Sign up for secure job tracking & analytics"
                : mode === "mfa"
                ? "Enter the 6-digit TOTP code from your authenticator app"
                : "Sign in to access your secure application portal"}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
            <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon size={16} className="absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          {mode !== "mfa" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Password Strength Indicator for Register */}
          {mode === "register" && password.length > 0 && (
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400">Password Policy Requirements:</span>
                <span className={`font-bold ${passScore === 5 ? "text-emerald-400" : "text-amber-400"}`}>
                  Score: {passScore}/5
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-slate-400">
                <span className={`flex items-center gap-1 ${hasMinLength ? "text-emerald-400" : ""}`}>
                  <CheckCircle2 size={11} /> Min 10 Chars
                </span>
                <span className={`flex items-center gap-1 ${hasUpper ? "text-emerald-400" : ""}`}>
                  <CheckCircle2 size={11} /> Uppercase (A-Z)
                </span>
                <span className={`flex items-center gap-1 ${hasLower ? "text-emerald-400" : ""}`}>
                  <CheckCircle2 size={11} /> Lowercase (a-z)
                </span>
                <span className={`flex items-center gap-1 ${hasNumber ? "text-emerald-400" : ""}`}>
                  <CheckCircle2 size={11} /> Number (0-9)
                </span>
                <span className={`flex items-center gap-1 ${hasSpecial ? "text-emerald-400" : ""}`}>
                  <CheckCircle2 size={11} /> Special (!@#$)
                </span>
              </div>
            </div>
          )}

          {/* MFA 6-digit input */}
          {mode === "mfa" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Authenticator 6-Digit Code
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="123456"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-sm font-mono tracking-widest text-center text-emerald-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-brand-600 py-2.5 text-xs font-bold text-white hover:bg-brand-500 transition-colors shadow-md disabled:opacity-50"
          >
            {isLoading
              ? "Processing..."
              : mode === "register"
              ? "Create Secure Account"
              : mode === "mfa"
              ? "Verify MFA Code"
              : "Sign In"}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-4 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          {mode === "register" ? (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setErrorMsg(null);
                }}
                className="font-semibold text-brand-400 hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setErrorMsg(null);
                }}
                className="font-semibold text-brand-400 hover:underline"
              >
                Create Account
              </button>
            </p>
          ) : (
            <button
              onClick={() => setMode("login")}
              className="font-semibold text-slate-400 hover:text-white"
            >
              ← Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
