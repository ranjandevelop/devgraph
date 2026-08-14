import { runQuery, toProps } from "../db/query";
import { AppError } from "../middleware/errorHandler";
import type { Package } from "../types/graph";

export async function listPackages(search?: string): Promise<Package[]> {
  const rows = await runQuery<{ p: any }>(
    search
      ? `MATCH (p:Package) WHERE toLower(p.name) CONTAINS toLower($search)
         RETURN p ORDER BY p.downloads DESC LIMIT 25`
      : `MATCH (p:Package) RETURN p ORDER BY p.downloads DESC LIMIT 50`,
    search ? { search } : {},
  );

  return rows.map((row) => toProps<Package>(row.p));
}

export async function getPackageByName(name: string): Promise<Package> {
  const rows = await runQuery<{ p: any }>(
    `MATCH (p:Package {name: $name}) RETURN p`,
    { name },
  );

  if (rows.length === 0) {
    throw new AppError(404, `Package "${name}" not found`);
  }

  return toProps<Package>(rows[0].p);
}

export async function getDependencies(name: string): Promise<Package[]> {
  await getPackageByName(name);

  const rows = await runQuery<{ dep: any }>(
    `MATCH (:Package {name: $name})-[:DEPENDS_ON]->(dep:Package)
     RETURN dep
     ORDER BY dep.name`,
    { name },
  );

  return rows.map((row) => toProps<Package>(row.dep));
}

export async function getDependents(name: string): Promise<Package[]> {
  await getPackageByName(name);

  const rows = await runQuery<{ dependent: any }>(
    `MATCH (dependent:Package)-[:DEPENDS_ON]->(:Package {name: $name})
     RETURN dependent
     ORDER BY dependent.name`,
    { name },
  );

  return rows.map((row) => toProps<Package>(row.dependent));
}

export interface SharedDependencyResult {
  package: Package;
  sharedDependencies: string[];
}

export async function getSharedDependencies(name: string): Promise<SharedDependencyResult[]> {
  await getPackageByName(name);

  const rows = await runQuery<{ other: any; shared: string[] }>(
    `MATCH (:Package {name: $name})-[:DEPENDS_ON]->(dep:Package)<-[:DEPENDS_ON]-(other:Package)
     WHERE other.name <> $name
     RETURN other, collect(DISTINCT dep.name) AS shared
     ORDER BY size(shared) DESC, other.name`,
    { name },
  );

  return rows.map((row) => ({
    package: toProps<Package>(row.other),
    sharedDependencies: row.shared,
  }));
}
