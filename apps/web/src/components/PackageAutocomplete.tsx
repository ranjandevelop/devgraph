"use client";

import { useEffect, useRef, useState } from "react";
import { listPackages } from "@/lib/api";
import type { Package } from "@/types/graph";

export function PackageAutocomplete({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [results, setResults] = useState<Package[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing on empty query, per React's documented fetch-in-effect pattern
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      listPackages(value.trim())
        .then(setResults)
        .catch(() => setResults([]));
    }, 200);

    return () => clearTimeout(timeout);
  }, [value]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-1">
      <label className="mb-1 block text-xs font-medium text-zinc-500">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="package name"
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-indigo-950"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          {results.map((pkg) => (
            <li key={pkg.name}>
              <button
                type="button"
                onClick={() => {
                  onChange(pkg.name);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-indigo-50 dark:hover:bg-zinc-800"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{pkg.name}</span>
                <span className="text-xs text-zinc-500">{pkg.version}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
