import {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
  ApplicationFilters,
  User,
  AuditLog,
  Transaction,
  MfaSetupResponse,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("app_tracker_token");
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("app_tracker_token", token);
  } else {
    localStorage.removeItem("app_tracker_token");
  }
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({ error: "Unknown error" }))) as { error: string };
      throw new Error(body.error ?? `Request failed with status ${res.status}`);
    }

    return res.json() as Promise<T>;
  } catch (err: any) {
    if (err.message === "Failed to fetch") {
      throw new Error("Unable to connect to backend server. Please make sure the backend process is running on port 5000.");
    }
    throw err;
  }
}

export const api = {
  auth: {
    register: (body: { email: string; password: string; name: string }) =>
      request<{ data: { user: User; token: string } }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    login: (body: { email: string; password: string; mfaCode?: string }) =>
      request<{ mfaRequired?: boolean; data?: { user: User; token: string }; message?: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    me: () => request<{ data: { user: User } }>("/auth/me"),

    mfaSetup: () => request<{ data: MfaSetupResponse }>("/auth/mfa/setup", { method: "POST" }),

    mfaVerify: (secret: string, token: string) =>
      request<{ message: string }>("/auth/mfa/verify", {
        method: "POST",
        body: JSON.stringify({ secret, token }),
      }),

    mfaDisable: (password?: string) =>
      request<{ message: string }>("/auth/mfa/disable", {
        method: "POST",
        body: JSON.stringify({ password }),
      }),
  },

  profile: {
    get: () => request<{ data: User }>("/profile"),

    update: (body: { name?: string; email?: string }) =>
      request<{ data: User }>("/profile", {
        method: "PATCH",
        body: JSON.stringify(body),
      }),

    changePassword: (currentPassword: string, newPassword: string) =>
      request<{ message: string }>("/profile/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      }),

    exportData: () => request<{ data: any }>("/profile/export"),

    importData: (applications: any[]) =>
      request<{ message: string; data: { count: number } }>("/profile/import", {
        method: "POST",
        body: JSON.stringify({ applications }),
      }),

    deleteAccount: (password?: string) =>
      request<{ message: string }>("/profile/account", {
        method: "DELETE",
        body: JSON.stringify({ password }),
      }),
  },

  applications: {
    list: (filters: ApplicationFilters = {}) => {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.search) params.set("search", filters.search);
      const qs = params.toString();
      return request<{ data: Application[]; total: number }>(
        `/applications${qs ? `?${qs}` : ""}`
      );
    },

    getById: (id: string) =>
      request<{ data: Application }>(`/applications/${id}`),

    create: (body: CreateApplicationInput) =>
      request<{ data: Application }>("/applications", {
        method: "POST",
        body: JSON.stringify({
          ...body,
          applied_date: new Date(body.applied_date).toISOString(),
          notes: body.notes || undefined,
        }),
      }),

    update: (id: string, body: UpdateApplicationInput) =>
      request<{ data: Application }>(`/applications/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...body,
          ...(body.applied_date
            ? { applied_date: new Date(body.applied_date).toISOString() }
            : {}),
        }),
      }),

    delete: (id: string) =>
      request<{ message: string }>(`/applications/${id}`, {
        method: "DELETE",
      }),
  },

  transactions: {
    create: (amount: number, idempotencyKey: string, description?: string) =>
      request<{ message: string; data: Transaction }>("/transactions", {
        method: "POST",
        body: JSON.stringify({ amount, idempotencyKey, description }),
      }),

    list: () => request<{ data: Transaction[] }>("/transactions"),
  },

  admin: {
    getUsers: () => request<{ data: any[] }>("/admin/users"),

    unlockUser: (id: string) =>
      request<{ message: string }>(`/admin/users/${id}/unlock`, { method: "POST" }),

    getLogs: (page = 1, action?: string) => {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (action) params.set("action", action);
      return request<{ data: AuditLog[]; pagination: any }>(`/admin/logs?${params.toString()}`);
    },
  },
};
