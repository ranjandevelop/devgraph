"use client";

import { useState } from "react";
import { PackageListPanel } from "./PackageListPanel";
import { GraphPanel } from "./GraphPanel";
import { SharedPanel } from "./SharedPanel";

type Tab = "dependencies" | "dependents" | "graph" | "shared";

const TABS: { key: Tab; label: string }[] = [
  { key: "dependencies", label: "Dependencies" },
  { key: "dependents", label: "Dependents" },
  { key: "graph", label: "Dependency graph" },
  { key: "shared", label: "Shared dependencies" },
];

export function PackageDetailTabs({ name }: { name: string }) {
  const [active, setActive] = useState<Tab>("dependencies");

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`shrink-0 px-4 py-2 text-sm font-medium transition ${
              active === tab.key
                ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-6">
        {active === "dependencies" && <PackageListPanel name={name} kind="dependencies" />}
        {active === "dependents" && <PackageListPanel name={name} kind="dependents" />}
        {active === "graph" && <GraphPanel name={name} />}
        {active === "shared" && <SharedPanel name={name} />}
      </div>
    </div>
  );
}
