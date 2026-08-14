"use client";

import { getDependencies, getDependents } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { PackageCard } from "./PackageCard";
import { Loading, EmptyState, ErrorState } from "./StateViews";

export function PackageListPanel({
  name,
  kind,
}: {
  name: string;
  kind: "dependencies" | "dependents";
}) {
  const fetcher = kind === "dependencies" ? getDependencies : getDependents;
  const { data, loading, error } = useAsync(() => fetcher(name), [name, kind]);

  if (loading) return <Loading label={`Loading ${kind}…`} />;
  if (error) return <ErrorState description={error} />;

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={
          kind === "dependencies" ? "No direct dependencies" : "Nothing depends on this package"
        }
        description={
          kind === "dependencies"
            ? `${name} doesn't declare any direct dependencies in this graph.`
            : `No other package in this graph depends on ${name} directly.`
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((pkg) => (
        <PackageCard key={pkg.name} pkg={pkg} />
      ))}
    </div>
  );
}
