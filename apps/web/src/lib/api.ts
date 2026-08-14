import type {
  GraphResult,
  Package,
  PathResult,
  SharedDependencyResult,
} from "@/types/graph";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

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
