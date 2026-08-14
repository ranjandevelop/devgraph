import { notFound } from "next/navigation";
import { getPackage, ApiError } from "@/lib/api";
import { PackageDetailTabs } from "@/components/PackageDetailTabs";
import { formatDownloads } from "@/lib/format";

export default async function PackagePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  let pkg;
  try {
    pkg = await getPackage(name);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">{pkg.name}</h1>
          <span className="text-zinc-500">v{pkg.version}</span>
        </div>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">{pkg.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
          <span>{formatDownloads(pkg.downloads)} downloads/week</span>
          <span aria-hidden="true">·</span>
          <span>{pkg.license} license</span>
          <a
            href={pkg.repository}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Repository ↗
          </a>
        </div>
      </header>

      <PackageDetailTabs name={pkg.name} />
    </div>
  );
}
