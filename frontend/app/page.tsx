"use client";

import { useState, useCallback, useEffect } from "react";
import { Plus, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { Application, Status } from "@/types";
import { api } from "@/lib/api";
import DashboardStats from "@/components/DashboardStats";
import ApplicationTable from "@/components/ApplicationTable";
import ApplicationForm from "@/components/ApplicationForm";
import ViewApplicationModal from "@/components/ViewApplicationModal";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import SearchBar from "@/components/SearchBar";
import StatusFilter from "@/components/StatusFilter";

export default function Home() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);
  const [deletingApp, setDeletingApp] = useState<Application | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.applications.list({
        status: statusFilter || undefined,
        search: search || undefined,
      });
      setApplications(res.data);
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, search]);

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
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Job Tracker
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Track and manage all your job applications in one place
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchApplications}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={() => {
                setEditingApp(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors shadow-sm"
            >
              <Plus size={16} />
              Add Application
            </button>
          </div>
        </div>

        <div className="mb-6">
          <DashboardStats applications={applications} />
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <StatusFilter value={statusFilter} onChange={setStatusFilter} />
        </div>

        <ApplicationTable
          applications={applications}
          isLoading={isLoading}
          onView={(app) => setViewingApp(app)}
          onEdit={handleEdit}
          onDelete={(app) => setDeletingApp(app)}
        />
      </div>

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
    </main>
  );
}
