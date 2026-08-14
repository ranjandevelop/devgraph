"use client";

import { useState } from "react";
import { getGraph } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { DependencyGraph } from "./DependencyGraph";
import { Loading, ErrorState, EmptyState } from "./StateViews";

export function GraphPanel({ name }: { name: string }) {
  const [depth, setDepth] = useState<1 | 2 | 3>(2);
  const { data, loading, error } = useAsync(() => getGraph(name, depth), [name, depth]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-zinc-500">Depth:</span>
        {([1, 2, 3] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDepth(d)}
            className={`rounded-md px-3 py-1 font-medium transition ${
              depth === d
                ? "bg-indigo-500 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {d} hop{d > 1 ? "s" : ""}
          </button>
        ))}
      </div>

      {loading && <Loading label="Building graph…" />}
      {error && <ErrorState description={error} />}
      {data && data.nodes.length <= 1 && (
        <EmptyState
          title="No dependencies to visualize"
          description={`${name} has no dependencies within ${depth} hop${depth > 1 ? "s" : ""}.`}
        />
      )}
      {data && data.nodes.length > 1 && <DependencyGraph graph={data} focusName={name} />}
    </div>
  );
}
