import Link from "next/link";
import { listPackages } from "@/lib/api";
import { PackageCard } from "@/components/PackageCard";
import { PackageSearch } from "@/components/PackageSearch";
import { ErrorState } from "@/components/StateViews";
import { ApiError } from "@/lib/api";

export default async function HomePage() {
  let popular: Awaited<ReturnType<typeof listPackages>> = [];
  let error: string | null = null;

  try {
    popular = await listPackages();
  } catch (err) {
    error = err instanceof ApiError ? err.message : "Something went wrong";
  }

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col items-center gap-6 py-10 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Explore how npm packages depend on each other
        </h1>
        <p className="max-w-xl text-zinc-500">
          DevGraph models packages, maintainers, organizations and dependency chains as a
          graph in CognoDB. Search a package, walk its dependency tree, or find the
          connection between two packages.
        </p>
        <div className="w-full max-w-xl">
          <PackageSearch variant="hero" autoFocus />
        </div>
        <Link
          href="/path"
          className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Or find a connection between two packages →
        </Link>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Popular packages
        </h2>
        {error ? (
          <ErrorState title="Couldn't load packages" description={error} />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((pkg) => (
              <PackageCard key={pkg.name} pkg={pkg} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
