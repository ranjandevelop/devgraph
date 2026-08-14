import Link from "next/link";
import { PackageSearch } from "./PackageSearch";

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50"
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500" />
          DevGraph
        </Link>
        <div className="hidden max-w-sm flex-1 sm:block">
          <PackageSearch variant="compact" />
        </div>
        <nav className="ml-auto flex items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link href="/path" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Find a connection
          </Link>
        </nav>
      </div>
    </header>
  );
}
