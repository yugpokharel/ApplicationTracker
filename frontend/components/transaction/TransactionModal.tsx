"use client";

import React, { useState } from "react";
import { X, Sparkles, ShieldCheck, CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { Transaction } from "@/types";
import toast from "react-hot-toast";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const [amount, setAmount] = useState(29.99);
  const [plan, setPlan] = useState("Premium AI Resume & Career Insights");
  const [idempotencyKey, setIdempotencyKey] = useState(`idemp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  if (!isOpen) return null;

  const handleProcessTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await api.transactions.create(amount, idempotencyKey, plan);
      setCompletedTx(res.data);
      toast.success(res.message || "Transaction processed with HMAC integrity verification!");
    } catch (err: any) {
      toast.error(err.message || "Transaction failure.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl ring-1 ring-white/10 text-white overflow-hidden p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 ring-1 ring-amber-500/30">
            <Sparkles className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Secure Transaction Hub</h3>
            <p className="text-xs text-slate-400">HMAC-SHA256 Signed & Idempotent Credit Checkout</p>
          </div>
        </div>

        {completedTx ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 size={18} /> Transaction Verified & Completed
            </div>
            <div className="space-y-1 text-slate-300 text-[11px] font-mono">
              <p><span className="text-slate-500">Transaction ID:</span> {completedTx.id}</p>
              <p><span className="text-slate-500">Idempotency Key:</span> {completedTx.idempotencyKey}</p>
              <p><span className="text-slate-500">Amount Paid:</span> ${completedTx.amount} {completedTx.currency}</p>
              <p className="truncate"><span className="text-slate-500">HMAC Signature:</span> {completedTx.hmacSignature}</p>
            </div>
            <button
              onClick={() => {
                setCompletedTx(null);
                setIdempotencyKey(`idemp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
              }}
              className="w-full rounded-lg bg-emerald-600 py-2 font-bold text-white hover:bg-emerald-500 mt-2"
            >
              New Transaction
            </button>
          </div>
        ) : (
          <form onSubmit={handleProcessTransaction} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Selected Plan</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white"
              >
                <option value="Premium AI Resume & Career Insights">Premium AI Resume & Insights ($29.99)</option>
                <option value="Unlimited Application Tracking Upgrade">Unlimited Application Tracking Upgrade ($49.99)</option>
              </select>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>Idempotency Key (Replay Lock):</span>
                <span className="text-amber-400 font-bold">{idempotencyKey.slice(0, 14)}...</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Integrity Protection:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Lock size={10} /> HMAC SHA-256
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-brand-600 py-2.5 text-xs font-bold text-white hover:from-amber-400 hover:to-brand-500 transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-2"
            >
              <CreditCard size={15} />
              {isProcessing ? "Executing Atomic DB Transaction..." : `Execute Secure Checkout ($${amount})`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
