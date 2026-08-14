"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { findPath, ApiError } from "@/lib/api";
import type { PathResult } from "@/types/graph";
import { PackageAutocomplete } from "./PackageAutocomplete";
import { DependencyGraph } from "./DependencyGraph";
import { Loading, EmptyState, ErrorState } from "./StateViews";

export function PathFinder() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [from, setFrom] = useState(searchParams.get("from") ?? "");
  const [to, setTo] = useState(searchParams.get("to") ?? "");
  const [result, setResult] = useState<PathResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const f = searchParams.get("from");
    const t = searchParams.get("to");
    if (!f || !t) return;

    // Syncing local state from the URL and resetting to a loading state
    // before an async fetch, per React's documented fetch-in-effect pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFrom(f);
    setTo(t);
    setLoading(true);
    setSearched(true);
    setError(null);
    setResult(null);

    findPath(f, t)
      .then((data) => setResult(data))
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Something went wrong");
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!from.trim() || !to.trim()) return;
    router.push(
      `/path?from=${encodeURIComponent(from.trim())}&to=${encodeURIComponent(to.trim())}`,
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="text-center">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Find a connection
        </h1>
        <p className="mt-2 text-zinc-500">
          See how any two packages in the graph are connected, however many hops apart.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-xl flex-col gap-4 sm:flex-row sm:items-end"
      >
        <PackageAutocomplete label="From" value={from} onChange={setFrom} />
        <PackageAutocomplete label="To" value={to} onChange={setTo} />
        <button
          type="submit"
          className="h-10 shrink-0 rounded-lg bg-indigo-500 px-5 text-sm font-medium text-white hover:bg-indigo-600"
        >
          Find path
        </button>
      </form>

      {loading && <Loading label="Searching for a connection…" />}
      {!loading && error && <ErrorState title="No connection found" description={error} />}
      {!loading && !error && searched && result && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            {result.nodes.map((node, i) => (
              <span key={node.name} className="flex items-center gap-2">
                <Link
                  href={`/packages/${encodeURIComponent(node.name)}`}
                  className="rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900"
                >
                  {node.name}
                </Link>
                {i < result.nodes.length - 1 && <span className="text-zinc-400">→</span>}
              </span>
            ))}
          </div>
          <p className="text-center text-sm text-zinc-500">
            {result.hops} hop{result.hops > 1 ? "s" : ""} apart
          </p>
          <DependencyGraph graph={result} />
        </div>
      )}
      {!loading && !searched && (
        <EmptyState
          title="Pick two packages to get started"
          description="Try react and scheduler, or express and debug."
        />
      )}
    </div>
  );
}
