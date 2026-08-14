import type {
  GraphResult,
  Package,
  PathResult,
  SharedDependencyResult,
} from "@/types/graph";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

if (
  typeof window !== "undefined" &&
  API_URL.includes("localhost") &&
  !["localhost", "127.0.0.1"].includes(window.location.hostname)
) {
  // This deployment is missing NEXT_PUBLIC_API_URL, so it's falling back to
  // localhost — every API call will fail (often surfacing as a confusing
  // CORS error, since whatever answers on the visitor's own localhost:5000
  // won't send the right headers). Set NEXT_PUBLIC_API_URL in the hosting
  // provider's env vars and redeploy — NEXT_PUBLIC_* vars are inlined at
  // build time, so saving the value alone isn't enough.
  console.error(
    `[DevGraph] NEXT_PUBLIC_API_URL is not set for this deployment — API calls are ` +
      `falling back to ${API_URL}, which will not work from ${window.location.origin}. ` +
      `Set NEXT_PUBLIC_API_URL to your deployed API URL and redeploy.`,
  );
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function apiFetch<T>(path: string): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  } catch {
    throw new ApiError(503, "Could not reach the DevGraph API. Is it running?");
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, body?.error?.message ?? "Something went wrong");
  }

  return body.data as T;
}

export const listPackages = (search?: string) =>
  apiFetch<Package[]>(`/api/packages${search ? `?search=${encodeURIComponent(search)}` : ""}`);

export const getPackage = (name: string) =>
  apiFetch<Package>(`/api/packages/${encodeURIComponent(name)}`);

export const getDependencies = (name: string) =>
  apiFetch<Package[]>(`/api/packages/${encodeURIComponent(name)}/dependencies`);

export const getDependents = (name: string) =>
  apiFetch<Package[]>(`/api/packages/${encodeURIComponent(name)}/dependents`);

export const getSharedDependencies = (name: string) =>
  apiFetch<SharedDependencyResult[]>(
    `/api/packages/${encodeURIComponent(name)}/shared-dependencies`,
  );

export const getGraph = (name: string, depth: 1 | 2 | 3) =>
  apiFetch<GraphResult>(`/api/packages/${encodeURIComponent(name)}/graph?depth=${depth}`);

export const findPath = (from: string, to: string) =>
  apiFetch<PathResult>(
    `/api/graph/path?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
  );
