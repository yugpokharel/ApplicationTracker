import {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
  ApplicationFilters,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Unknown error" })) as { error: string };
    throw new Error(body.error ?? `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
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
};
