import Link from "next/link";

export default function PackageNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Package not found
      </h1>
      <p className="max-w-md text-zinc-500">
        We couldn&apos;t find that package in the graph. Try searching for another one.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
      >
        ← Back to search
      </Link>
    </div>
  );
}
