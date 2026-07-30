"use client";

import { useState, useCallback, useEffect } from "react";
import { Plus, RefreshCw, Briefcase, Lock, Sparkles, LayoutGrid, ListFilter } from "lucide-react";
import toast from "react-hot-toast";
import { Application, Status } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardStats from "@/components/DashboardStats";
import ApplicationTable from "@/components/ApplicationTable";
import KanbanBoard from "@/components/KanbanBoard";
import ApplicationForm from "@/components/ApplicationForm";
import ViewApplicationModal from "@/components/ViewApplicationModal";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import AuthModal from "@/components/auth/AuthModal";
import ProfileModal from "@/components/profile/ProfileModal";
import AdminDashboardModal from "@/components/admin/AdminDashboardModal";
import TransactionModal from "@/components/transaction/TransactionModal";
import PrivacyModal from "@/components/PrivacyModal";
import SearchBar from "@/components/SearchBar";
import StatusFilter from "@/components/StatusFilter";

export default function Home() {
  const { user, openAuthModal } = useAuth();
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [search, setSearch] = useState("");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);
  const [deletingApp, setDeletingApp] = useState<Application | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const fetchApplications = useCallback(async () => {
    if (!user) {
      setApplications([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.applications.list({
        status: statusFilter || undefined,
        search: search || undefined,
      });
      setApplications(res.data);
    } catch {
      toast.error("Failed to load applications.");
    } finally {
      setIsLoading(false);
    }
  }, [user, statusFilter, search]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleDelete = async () => {
    if (!deletingApp) return;
    setIsDeleting(true);
    try {
      await api.applications.delete(deletingApp.id);
      toast.success(`Deleted ${deletingApp.company_name}`);
      setDeletingApp(null);
      fetchApplications();
    } catch {
      toast.error("Failed to delete application");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (app: Application, newStatus: Status) => {
    try {
      await api.applications.update(app.id, { status: newStatus });
      toast.success(`Updated ${app.company_name} status to ${newStatus}`);
      fetchApplications();
    } catch {
      toast.error("Failed to update application status");
    }
  };

  const handleFormSuccess = () => {
    toast.success(editingApp ? "Application updated!" : "Application added!");
    setEditingApp(null);
    fetchApplications();
  };

  const handleEdit = (app: Application) => {
    setViewingApp(null);
    setEditingApp(app);
    setIsFormOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        activeView={viewMode}
        onViewChange={setViewMode}
        onOpenAddModal={() => {
          if (!user) {
            openAuthModal("login");
            return;
          }
          setEditingApp(null);
          setIsFormOpen(true);
        }}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenTransactionModal={() => setIsTransactionModalOpen(true)}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Guest Hero Banner */}
          {!user ? (
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950/40 p-8 sm:p-12 shadow-2xl mb-8">
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                  Track every job application in one place
                </h1>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                  Organize your job search, manage application statuses, prepare for interviews, and keep track of offer deadlines effortlessly.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openAuthModal("register")}
                    className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-xs font-bold text-white hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/25"
                  >
                    Get Started Free
                  </button>
                  <button
                    onClick={() => openAuthModal("login")}
                    className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all"
                  >
                    <Lock size={14} />
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Authenticated Dashboard Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                    Job Dashboard
                  </h1>
                  <p className="text-slate-400 mt-1 text-xs sm:text-sm">
                    Manage and track all your active applications
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchApplications}
                    className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
                  >
                    <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                    Refresh
                  </button>
                  <button
                    onClick={() => {
                      setEditingApp(null);
                      setIsFormOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white hover:from-brand-500 hover:to-indigo-500 transition-all shadow-md shadow-brand-600/20"
                  >
                    <Plus size={16} />
                    Add Application
                  </button>
                </div>
              </div>

              {/* Statistics Dashboard */}
              <div className="mb-6">
                <DashboardStats applications={applications} />
              </div>

              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                <div className="flex-1">
                  <SearchBar value={search} onChange={setSearch} />
                </div>
                <StatusFilter value={statusFilter} onChange={setStatusFilter} />

                {/* View Switcher for mobile/tablet */}
                <div className="flex md:hidden items-center p-1 bg-slate-900 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md ${
                      viewMode === "table" ? "bg-brand-600 text-white" : "text-slate-400"
                    }`}
                  >
                    <ListFilter size={14} />
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode("kanban")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md ${
                      viewMode === "kanban" ? "bg-brand-600 text-white" : "text-slate-400"
                    }`}
                  >
                    <LayoutGrid size={14} />
                    Kanban
                  </button>
                </div>
              </div>

              {/* Applications View Component */}
              {viewMode === "table" ? (
                <ApplicationTable
                  applications={applications}
                  isLoading={isLoading}
                  onView={(app) => setViewingApp(app)}
                  onEdit={handleEdit}
                  onDelete={(app) => setDeletingApp(app)}
                />
              ) : (
                <KanbanBoard
                  applications={applications}
                  isLoading={isLoading}
                  onView={(app) => setViewingApp(app)}
                  onEdit={handleEdit}
                  onDelete={(app) => setDeletingApp(app)}
                  onStatusChange={handleStatusChange}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)} />

      {/* Modals */}
      <AuthModal />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <ApplicationForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingApp(null);
        }}
        onSuccess={handleFormSuccess}
        editingApplication={editingApp}
      />

      <ViewApplicationModal
        application={viewingApp}
        onClose={() => setViewingApp(null)}
        onEdit={handleEdit}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingApp}
        companyName={deletingApp?.company_name ?? ""}
        onConfirm={handleDelete}
        onCancel={() => setDeletingApp(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
