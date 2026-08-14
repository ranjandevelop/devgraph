"use client";

import Link from "next/link";
import { getSharedDependencies } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { Loading, EmptyState, ErrorState } from "./StateViews";

export function SharedPanel({ name }: { name: string }) {
  const { data, loading, error } = useAsync(() => getSharedDependencies(name), [name]);

  if (loading) return <Loading label="Finding shared dependencies…" />;
  if (error) return <ErrorState description={error} />;

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No shared dependencies found"
        description={`No other package in this graph depends on the same things as ${name}.`}
      />
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
      {data.map((row) => (
        <li
          key={row.package.name}
          className="flex flex-wrap items-center justify-between gap-2 py-3"
        >
          <Link
            href={`/packages/${encodeURIComponent(row.package.name)}`}
            className="font-medium text-zinc-900 hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
          >
            {row.package.name}
          </Link>
          <span className="text-sm text-zinc-500">
            shares {row.sharedDependencies.join(", ")}
          </span>
        </li>
      ))}
    </ul>
  );
}
