"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { listPackages } from "@/lib/api";
import type { Package } from "@/types/graph";

export function PackageSearch({
  variant = "compact",
  autoFocus = false,
}: {
  variant?: "compact" | "hero";
  autoFocus?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Package[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing on empty query, per React's documented fetch-in-effect pattern
      setResults([]);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(() => {
      listPackages(query.trim())
        .then((data) => setResults(data))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function goToPackage(name: string) {
    setOpen(false);
    setQuery("");
    router.push(`/packages/${encodeURIComponent(name)}`);
  }

  const isHero = variant === "hero";

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={query}
        autoFocus={autoFocus}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && results.length > 0) {
            goToPackage(results[0].name);
          }
        }}
        placeholder="Search packages, e.g. react, express, webpack..."
        className={
          isHero
            ? "w-full rounded-xl border border-zinc-300 bg-white px-5 py-4 text-lg shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-indigo-950"
            : "w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-indigo-950"
        }
      />
      {open && query.trim() && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          {loading ? (
            <div className="px-4 py-3 text-sm text-zinc-500">Searching…</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-zinc-500">
              No packages match &quot;{query}&quot;
            </div>
          ) : (
            <ul className="max-h-72 overflow-y-auto">
              {results.map((pkg) => (
                <li key={pkg.name}>
                  <button
                    type="button"
                    onClick={() => goToPackage(pkg.name)}
                    className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-indigo-50 dark:hover:bg-zinc-800"
                  >
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {pkg.name}
                    </span>
                    <span className="text-xs text-zinc-500">{pkg.version}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
