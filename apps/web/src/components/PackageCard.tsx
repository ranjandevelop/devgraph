import Link from "next/link";
import type { Package } from "@/types/graph";
import { formatDownloads } from "@/lib/format";

export function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <Link
      href={`/packages/${encodeURIComponent(pkg.name)}`}
      className="group rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-800"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400">
          {pkg.name}
        </span>
        <span className="shrink-0 text-xs text-zinc-500">{pkg.version}</span>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{pkg.description}</p>
      <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
        <span>{formatDownloads(pkg.downloads)} downloads/wk</span>
        <span aria-hidden="true">·</span>
        <span>{pkg.license}</span>
      </div>
    </Link>
  );
}
